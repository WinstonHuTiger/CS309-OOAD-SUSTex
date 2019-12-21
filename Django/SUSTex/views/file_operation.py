from django.http import HttpResponse, FileResponse
from SUSTex.models import User, Project, UserProject, Document
import subprocess
import json
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.join(os.path.dirname(os.path.abspath(__file__)), os.path.pardir), os.path.pardir))
USER_FILES_DIR = os.path.join(BASE_DIR, 'UserData/Projects/')
ALLOWED_POSTFIX = ['tex', 'bib', 'txt', 'md']


def file_manage_verify(request, random_str):
    if not request.user.is_authenticated:
        return HttpResponse('Please login first')
    user = User.objects.get(id=request.user.id)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project does not exist')
    project = response[0]
    response = UserProject.objects.filter(user=user, project=project)
    if response.count() == 0:
        return HttpResponse('You are not in this project yet')
    user_project = response[0]
    if user_project.authority != 'rw':
        return HttpResponse('You cannot create files')
    return None


def create_file(request, random_str):
    path = request.GET['path']
    filename = request.GET['filename']
    verify = file_manage_verify(request, random_str)
    if verify is not None:
        return verify
    lst = filename.split('.')
    if len(lst) == 1:
        return HttpResponse('You cannot create a file without a postfix')
    postfix = lst[-1]
    if postfix not in ALLOWED_POSTFIX:
        return HttpResponse('Invalid file type')
    project_path = os.path.join(USER_FILES_DIR, random_str)
    project_path = os.path.join(project_path, path)
    path = os.path.join(project_path, filename)
    file = open(path, 'w+')
    file.close()
    return HttpResponse(postfix)


def create_path(request, random_str):
    print(BASE_DIR)
    path = request.GET['path'].split('/')
    verify = file_manage_verify(request, random_str)
    if verify is not None:
        return verify
    project_path = os.path.join(USER_FILES_DIR, random_str)
    for i in path:
        project_path = os.path.join(project_path, i)
        if not os.path.isdir(project_path):
            os.makedirs(project_path)
    return HttpResponse("create path successfully")


def delete_file(request, random_str):
    path = request.GET['path']
    filename = request.GET['filename']
    verify = file_manage_verify(request, random_str)
    if verify is not None:
        return verify
    project_path = os.path.join(USER_FILES_DIR, random_str)
    project_path = os.path.join(project_path, path)
    path = os.path.join(project_path, filename)
    if os.path.exists(path):
        os.remove(path)
        return HttpResponse('Delete successfully')
    return HttpResponse('This file or path does not exist')


def delete_path(request, random_str):
    path = request.GET['path']
    verify = file_manage_verify(request, random_str)
    if verify is not None:
        return verify
    project_path = os.path.join(USER_FILES_DIR, random_str)
    project_path = os.path.join(project_path, path)
    if os.path.isdir(project_path):
        import shutil
        shutil.rmtree(project_path)
        return HttpResponse('Remove folder successfully')
    return HttpResponse('This path does not exist')


def upload_file(request, random_str):
    file = request.FILES.get('file')
    path = request.POST['path']
    verify = file_manage_verify(request, random_str)
    if verify:
        return verify
    filepath = os.path.join(USER_FILES_DIR, random_str)
    filepath = os.path.join(filepath, path)
    filename = str(file)
    if os.path.isdir(filepath):
        filepath = os.path.join(filepath, filename)
        f = open(filepath, 'wb')
        for i in file.chunks():
            f.write(i)
        f.close()
        return HttpResponse('Upload successfully')
    return HttpResponse('Filepath not exist')


def rename_file(request, random_str):
    filename = request.GET['filename']
    path = request.GET['path']
    new_name = request.GET['new_name']
    verify = file_manage_verify(request, random_str)
    if verify is not None:
        return verify
    project_path = os.path.join(USER_FILES_DIR, random_str)
    project_path = os.path.join(project_path, path)
    os.rename(os.path.join(project_path, filename), os.path.join(project_path, new_name))
    return HttpResponse('Rename file successfully')


def rename_path(request, random_str):
    path = request.GET['path'].split("/")
    new_name = request.GET['new_name']
    verify = file_manage_verify(request, random_str)
    if verify is not None:
        return verify
    project_path = os.path.join(USER_FILES_DIR, random_str)
    for i in range(len(path) - 1):
        project_path = os.path.join(project_path, path[i])
    old_path = os.path.join(project_path, path[-1])
    new_path = os.path.join(project_path, new_name)
    if os.path.isdir(old_path):
        os.rename(old_path, new_path)
        return HttpResponse("Rename Successfully")
    return HttpResponse('This path does not exist')


def download_file(request, random_str):
    filename = request.GET['file']
    path = request.GET['path']
    verify = file_manage_verify(request, random_str)
    if verify:
        return verify
    filepath = os.path.join(USER_FILES_DIR, random_str)
    filepath = os.path.join(filepath, path)
    filepath = os.path.join(filepath, filename)
    if os.path.isfile(filepath):
        f = open(filepath, 'rb')
        response = FileResponse(f)
        response['Content-Type'] = 'application/octect-stream'
        response['Content-Disposition'] = 'attachment;filename="%s"' % filename
        return response
    return HttpResponse('File not exist')


def compile_pdf(request, random_str):
    document = request.GET['document']
    path = request.GET['path']
    verify = file_manage_verify(request, random_str)
    if verify:
        return verify
    lst = document.split('.')
    filename = lst[0]
    postfix = lst[1]
    response = Document.objects.filter(filename=filename)
    if response.count() == 0:
        return HttpResponse('LaTex Document does not exist')
    doc = response[0]
    if postfix != 'tex' or doc.project.type != 'LaTex':
        return HttpResponse('Not a LaTex document!')
    project_path = os.path.join(USER_FILES_DIR, random_str)
    folder_path = os.path.join(project_path, path)
    filepath = os.path.join(folder_path, document)
    if os.path.isfile(filepath):
        try:
            cmd = ['pdflatex', '-quiet', filepath, '-aux-directory=%s' % os.path.join(project_path, 'log')]
            print(cmd)
            p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
            content = p.stdout.read().decode('utf8')
            lines = content.split('\r\n')
        except Exception:
            return HttpResponse('Compile fail')
        errors = []
        for line in lines:
            if line == '':
                pass
            else:
                errors.append(line[line.rfind('/') + 1:])
                return HttpResponse(json.dumps(line[line.rfind('/') + 1:]))
        pdf_path = os.path.join(project_path, filename + '.pdf')
        response = FileResponse(pdf_path)
        response['Content-Type'] = 'application/pdf'
        return response
    return HttpResponse('LaTex Document does not exist')
