from django.contrib.auth.decorators import login_required
from django.contrib import auth
from django.http import HttpResponse
from SUSTex.models import User, Project, Document, UserProject, Authorization
import os
import json
from Utils.diff_match_patch import diff_match_patch


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
USER_FILES_DIR = os.path.join(BASE_DIR, 'UserData/Projects/')
ALLOWED_POSTFIX = ['tex', 'bib', 'txt', 'md']


# Create your views here.
def logout(request):
    auth.logout(request)
    return HttpResponse('Logout!')


def get_user_info(request):
    if not request.user.is_authenticated:
        return HttpResponse('Please login first.')
    user = User.objects.get(id=request.user.id)
    print(request.session)
    return HttpResponse(user)


def create_project(request):
    project_name = request.GET['name']
    if not request.user.is_authenticated:
        return HttpResponse('Not login yet, please login first.')
    user = User.objects.filter(id=request.user.id)[0]
    project = Project(name=project_name, type='LaTex')
    project.generate_random_str()
    project.create_project_path()
    project.save()
    project.create_document()
    user_project = UserProject(project=project, user=user)
    user_project.save()
    re = {'project': json.loads(project.__str__()), 'user_project': json.loads(user_project.__str__())}
    return HttpResponse(json.dumps(re))


def get_projects(request):
    return HttpResponse('Get projects')


def get_files(request):
    return HttpResponse('Get files')


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


def edit_doc(request, random_str, filename):
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project does not exist!')
    project = response[0]
    response = Document.objects.filter(project=project, filename=filename).order_by('version')
    print(response[0].version)
    print(response[1].version)
    return HttpResponse('Edit File')


def create_doc(request, random_str):
    filename = request.GET['filename']
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project does not exist!')
    project = response[0]
    project.create_document(filename)
    return HttpResponse('Create document successfully.')


def get_project_info(request, random_str):
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project does not exist!')
    project = response[0]
    info = project.get_info()
    return HttpResponse(info)


def authorize_to_other(request, random_str, authority):
    if not request.user.is_authenticated:
        return HttpResponse('Not login yet, please login first.')
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project does not exist!')
    project = response[0]
    user = User.objects.get(id=request.user.id)
    response = UserProject.objects.filter(project=project, user=user)
    if response.count() == 0:
        return HttpResponse('You have not been add to this project.')
    user_project = response[0]
    if user_project.authority != 'rw':
        return HttpResponse('You have no authority to authorize others.')
    response = Authorization.objects.filter(user=user, project=project)
    if authority == 'rw' and authority == 'r':
        return HttpResponse('Invalid authority')
    if response.count() != 0:
        authorization = response[0]
        authorization.authority = authority
        authorization.save()
        return HttpResponse(response[0])
    else:
        authorization = Authorization(project=project, user=user, authority=authority)
        authorization.get_random_code()
        authorization.save()
        return HttpResponse(authorization)


def authorize_user(request, code):
    if not request.user.is_authenticated:
        return HttpResponse('Not login yet, please login first.')
    user = User.objects.get(id=request.user.id)
    response = Authorization.objects.filter(code=code)
    if response.count() == 0:
        return HttpResponse('Authorization code is invalid')
    authorization = response[0]
    response = UserProject.objects.filter(project=authorization.project, user=user)
    if response.count() != 0:
        return HttpResponse('You already in this project')
    user_project = UserProject(user=user, project=authorization.project, authority=authorization.authority)
    user_project.save()
    authorization.delete()
    return HttpResponse(user_project)


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


def download_file(request, random_str):
    filename = request.get['filename']
    path = request.GET['path']
    verify = file_manage_verify(request, random_str)
    if verify:
        return verify
    filepath = os.path.join(USER_FILES_DIR, random_str)
    filepath = os.path.join(filepath, path)
    filepath = os.path.join(filepath, filename)
    if os.path.isfile(filepath):
        f = os.open(filepath, 'rb')

    return HttpResponse('File not exist')


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


def get_current_users(request):
    return HttpResponse('get current users')


def get_user_projects(request):
    if not request.user.is_authenticated:
        return HttpResponse('Please login first.')
    user = User.objects.get(id=request.user.id)
    response = UserProject.objects.filter(user=user)
    lst = []
    for i in response:
        lst.append(i.get_dict())
    return HttpResponse(json.dumps(lst))


def get_versions(request, random_str, filename):
    if not request.user.is_authenticated:
        return HttpResponse('Please login first')
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Invalid url')
    project = response[0]
    response = Document.objects.filter(project=project, filename=filename)
    if response.count() == 0:
        return HttpResponse('Invalid url')
    lst = []
    for i in response:
        lst.append(i.get_dict())
    return HttpResponse(json.dumps(lst))


def compare_versions(request, random_str, filename):
    if not request.user.is_authenticated:
        return HttpResponse('Please login first')
    user = User.objects.get(id=request.user.id)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project does not exist.')
    project = response[0]
    response = Document.objects.filter(project=project, filename=filename)
    if response.count() == 0:
        return HttpResponse('Document does not exist.')
    version_one = int(request.GET['version_one'])
    version_two = int(request.GET['version_two'])
    document_one = None
    document_two = None
    for i in response:
        if i.version == version_one:
            document_one = i
        elif i.version == version_two:
            document_two = i
    if document_one is None:
        return HttpResponse("Document '%s' version: %d does not exist" % (filename, version_one))
    if document_two is None:
        return HttpResponse("Document '%s' version: %d does not exist" % (filename, version_two))
    dmp = diff_match_patch()
    diffs = dmp.diff_main(text1=document_one.content, text2=document_two.content)
    dmp.diff_cleanupSemantic(diffs)
    return HttpResponse(json.dumps(diffs))


def create_version(request, random_str, filename):
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project does not exist!')
    project = response[0]
    project.create_version(filename)
    return HttpResponse('Create version.')


def rename_project(request, random_str):
    if not request.user.is_authenticated:
        return HttpResponse('Please login first')
    user = User.objects.get(id=request.user.id)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project dose not exist')
    project = response[0]
    project.name = request.GET['name']
    project.save()
    return HttpResponse('Rename successfully')