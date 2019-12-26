from django.http import HttpResponse, FileResponse
from wsgiref.util import FileWrapper
from SUSTex.models import User, Project, UserProject, Document
from SUSTex.views.views import get_response, ResponseType
import zipfile, tempfile, json, os, subprocess, shutil
import time


BASE_DIR = os.path.abspath(os.path.join(os.path.join(os.path.dirname(os.path.abspath(__file__)), os.path.pardir), os.path.pardir))
USER_FILES_DIR = os.path.join(BASE_DIR, 'UserData/Projects/')
ALLOWED_POSTFIX = ['tex', 'bib', 'txt', 'md']


# https://blog.csdn.net/weixin_42934547/article/details/82142476
def copy_dir(path, out):
    for files in os.listdir(path):
        name = os.path.join(path, files)
        back_name = os.path.join(out, files)
        if os.path.isfile(name):
            shutil.copy(name, back_name)
        else:
            if not os.path.isdir(back_name):
                os.makedirs(back_name)
            copy_dir(name, back_name)


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
    filename = request.GET['name']
    verify = file_manage_verify(request, random_str)
    if verify is not None:
        return verify
    # lst = filename.split('.')
    # if len(lst) == 1:
    #     return get_response(ResponseType.FILE_CORRUPTED, 'You cannot create a file without a postfix')
    # postfix = lst[-1]
    # if postfix not in ALLOWED_POSTFIX:
    #     return HttpResponse('Invalid file type')
    project_path = os.path.join(USER_FILES_DIR, random_str)
    project_path = os.path.join(project_path, path)
    path = os.path.join(project_path, filename)
    file = open(path, 'w+')
    file.close()
    return get_response(ResponseType.SUCCESS, "Create File Successfully!")


def create_path(request, random_str):
    path = request.GET['path']
    name = request.GET['name']
    path = os.path.join(path, name).split('/')
    verify = file_manage_verify(request, random_str)
    if verify is not None:
        return verify
    project_path = os.path.join(USER_FILES_DIR, random_str)
    for i in path:
        project_path = os.path.join(project_path, i)
        if not os.path.isdir(project_path):
            os.makedirs(project_path)
    return get_response(ResponseType.SUCCESS, "create path successfully")


def delete_file(request, random_str):
    path = request.GET['path']
    filename = request.GET['name']
    verify = file_manage_verify(request, random_str)
    if verify is not None:
        return verify
    project_path = os.path.join(USER_FILES_DIR, random_str)
    project_path = os.path.join(project_path, path)
    path = os.path.join(project_path, filename)
    if os.path.exists(path):
        os.remove(path)
        return get_response(ResponseType.SUCCESS, 'Delete successfully')
    return get_response(ResponseType.SUCCESS, 'This file or path does not exist')


def delete_path(request, random_str):
    path = request.GET['path']
    verify = file_manage_verify(request, random_str)
    if verify is not None:
        return verify
    project_path = os.path.join(USER_FILES_DIR, random_str)
    project_path = os.path.join(project_path, path)
    print(project_path)
    if os.path.isdir(project_path):
        import shutil
        shutil.rmtree(project_path)
        return get_response(ResponseType.SUCCESS, 'Remove folder successfully!')
    return get_response(ResponseType.SUCCESS, 'This path does not exist')


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
    path = request.GET['path']
    filename = request.GET['name']
    new_name = request.GET['new_name']
    verify = file_manage_verify(request, random_str)
    if verify is not None:
        return verify
    project_path = os.path.join(USER_FILES_DIR, random_str)
    project_path = os.path.join(project_path, path)
    os.rename(os.path.join(project_path, filename), os.path.join(project_path, new_name))
    return get_response(ResponseType.SUCCESS, 'Rename file successfully')


def rename_path(request, random_str):
    path = os.path.split(request.GET['path'])
    new_name = request.GET['name']
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
        return get_response(ResponseType.SUCCESS, "Rename Successfully")
    return get_response(ResponseType.SUCCESS, 'This path does not exist')


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


# https://stackoverflow.com/questions/67454/serving-dynamically-generated-zip-archives-in-django
def download_project(request, random_str):
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    project_path = os.path.join(USER_FILES_DIR, random_str)
    response = HttpResponse(content_type='application/zip')
    z = zipfile.ZipFile(response, 'w', zipfile.ZIP_DEFLATED)
    for dir_path, dir_names, file_names in os.walk(project_path):
        f_path = dir_path.replace(project_path, '')
        for filename in file_names:
            z.write(os.path.join(dir_path, filename), os.path.join(f_path, filename))
    response['Content-Disposition'] = 'attachment; filename=Package.zip'
    return response


def import_project(request):
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    try:
        file = request.FILES.get('file')
        zf = zipfile.ZipFile(file)
        user = User.objects.get(id=request.user.id)
        project = Project(name=str(file).split(".")[0], creator=user)
        project.generate_random_str()
        project.create_project_path()
        project_path = os.path.join(USER_FILES_DIR, project.random_str)
        zf.extractall(project_path)
        project.save()
        user_project = UserProject(project=project, user=user, type="Creator")
        user_project.save()
    except Exception as e:
        print(str(e))
        return get_response(ResponseType.FILE_CORRUPTED)
    return get_response(ResponseType.SUCCESS, "Import project successfully!")


def create_from_template(request):
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    category = request.GET["category"]
    title = request.GET["title"]
    folder_path = os.path.join(BASE_DIR, 'static/LaTex')
    folder_path = os.path.join(folder_path, category)
    folder_path = os.path.join(folder_path, title)
    user = User.objects.get(id=request.user.id)
    template = category + ", " + title
    response = Project.objects.filter(creator=user, template=template)
    if response.count() == 0:
        project_name = title + "-Template"
    else:
        project_name = title + "-Template" + "(%d)" % response.count()
    project = Project(creator=user, name=project_name, template=template)
    project.generate_random_str()
    project.create_project_path()
    project_path = os.path.join(USER_FILES_DIR, project.random_str)
    copy_dir(folder_path, project_path)
    project.save()
    user_project = UserProject(project=project, user=user, type="Creator")
    user_project.save()
    return get_response(ResponseType.SUCCESS, "SUCCESS")


def trans_time(timestamp):
    time_struct = time.localtime(timestamp)
    return time.strftime('%Y-%m-%d %H:%M:%S', time_struct)


# https://blog.csdn.net/qiqiyingse/article/details/83993098
def get_path_attribute(request, random_str):
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    path = request.GET["path"]
    project_path = os.path.join(USER_FILES_DIR, random_str)
    path = os.path.join(project_path, path)
    if not os.path.isdir(path):
        return get_response(ResponseType.DOCUMENT_NOT_FOUND)
    size = 0
    for root, dirs, files in os.walk(path):
        for f in files:
            size += os.path.getsize(os.path.join(root, f))
    ret = {
        "size": int(size / 1024),
        "access_time": trans_time(os.path.getatime(path)),
        "create_time": trans_time(os.path.getctime(path)),
        "modify_time": trans_time(os.path.getmtime(path))
    }
    return get_response(ResponseType.SUCCESS, ret)


def get_file_attribute(request, random_str):
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    path = request.GET["path"]
    name = request.GET["name"]
    if path == "":
        path = name
    else:
        path = os.path.join(path, name)
    project_path = os.path.join(USER_FILES_DIR, random_str)
    path = os.path.join(project_path, path)
    if not os.path.isfile(path):
        return get_response(ResponseType.DOCUMENT_NOT_FOUND)
    ret = {
        "size": int(os.path.getsize(path) / 1024),
        "access_time": trans_time(os.path.getatime(path)),
        "create_time": trans_time(os.path.getctime(path)),
        "modify_time": trans_time(os.path.getmtime(path))
    }
    return get_response(ResponseType.SUCCESS, ret)