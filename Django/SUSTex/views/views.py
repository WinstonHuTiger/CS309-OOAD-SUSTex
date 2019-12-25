from django.contrib.auth.decorators import login_required
from django.contrib import auth
from django.http import HttpResponse, FileResponse
from SUSTex.models import User, Project, Document, UserProject, Authorization, DocumentChange
from Utils.diff_match_patch import diff_match_patch
import json
import os
from enum import Enum, unique

BASE_DIR = os.path.abspath(os.path.join(os.path.join(os.path.dirname(os.path.abspath(__file__)), os.path.pardir), os.path.pardir))

@unique
class ResponseType(Enum):
    SUCCESS = 1
    NOT_AUTHENTICATED = 2
    PROJECT_NOT_FOUND = 3
    NOT_IN_PROJECT = 4
    NO_AUTHORITY = 5
    INVALID_AUTHORITY_CODE = 6
    ALREADY_IN_PROJECT = 7
    DOCUMENT_NOT_FOUND = 8
    VERSION_NOT_FOUND = 9
    FILE_CORRUPTED = 10
    DELETE_ERROR = 11


def get_response(res_type, message=None):
    if res_type == ResponseType.SUCCESS:
        return HttpResponse(json.dumps({
            "type": "success",
            "code": ResponseType.SUCCESS.value,
            "message": message
        }))
    elif res_type == ResponseType.NOT_AUTHENTICATED:
        return HttpResponse(json.dumps({
            "type": "error",
            "code": ResponseType.NOT_AUTHENTICATED.value,
            "message": "Not login or invalid cookie."
        }))
    elif res_type == ResponseType.PROJECT_NOT_FOUND.value:
        return HttpResponse(json.dumps({
            "type": "error",
            "code": ResponseType.PROJECT_NOT_FOUND.value,
            "message": "Project not found."
        }))
    elif res_type == ResponseType.NOT_IN_PROJECT:
        return HttpResponse(json.dumps({
            "type": "error",
            "code": ResponseType.NOT_IN_PROJECT.value,
            "message": "You haven't joined the project yet, please contact project's administrator."
        }))
    elif res_type == ResponseType.NO_AUTHORITY:
        return HttpResponse(json.dumps({
            "type": "error",
            "code": ResponseType.NO_AUTHORITY.value,
            "message": "You do not have permission to modify the file."
        }))
    elif res_type == ResponseType.INVALID_AUTHORITY_CODE:
        return HttpResponse(json.dumps({
            "type": "error",
            "code": ResponseType.INVALID_AUTHORITY_CODE.value,
            "message": "Authority code is invalid."
        }))
    elif res_type == ResponseType.ALREADY_IN_PROJECT:
        return HttpResponse(json.dumps({
            "type": "error",
            "code": ResponseType.ALREADY_IN_PROJECT.value,
            "message": "You are already in the project."
        }))
    elif res_type == ResponseType.DOCUMENT_NOT_FOUND:
        return HttpResponse(json.dumps({
            "type": "error",
            "code": ResponseType.DOCUMENT_NOT_FOUND.value,
            "message": "Document not found."
        }))
    elif res_type == ResponseType.VERSION_NOT_FOUND:
        return HttpResponse(json.dumps({
            "type": "error",
            "code": ResponseType.VERSION_NOT_FOUND.value,
            "message": "Document version: %d not found." % message
        }))
    elif res_type == ResponseType.FILE_CORRUPTED:
        return HttpResponse(json.dumps({
            "type": "error",
            "code": ResponseType.FILE_CORRUPTED.value,
            "message": "Invalid zip file."
        }))
    elif res_type == ResponseType.DELETE_ERROR:
        return HttpResponse(json.dumps({
            "type": "error",
            "code": ResponseType.DELETE_ERROR.value,
            "message": "Delete error, please try latter."
        }))


# Create your views here.
def logout(request):
    auth.logout(request)
    return get_response(ResponseType.SUCCESS, "Logout successfully!")


def get_user_info(request):
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    user = User.objects.get(id=request.user.id)
    return get_response(ResponseType.SUCCESS, user.get_dict())


def create_project(request):
    project_name = request.GET['name']
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    user = User.objects.filter(id=request.user.id)[0]
    project = Project(name=project_name, creator=user)
    project.generate_random_str()
    project.create_project_path()
    project.save()
    project.create_document()
    user_project = UserProject(project=project, user=user, type="Creator")
    user_project.save()
    re = {'project': json.loads(project.__str__()), 'user_project': json.loads(user_project.__str__())}
    return get_response(ResponseType.SUCCESS, re)


def create_doc(request, random_str):
    filename = request.GET['filename']
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    project.create_document(filename)
    return get_response(ResponseType.SUCCESS, "Create document successfully!")


def get_project_info(request, random_str):
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    info = project.get_info()
    return get_response(ResponseType.SUCCESS, info)


def authorize_to_other(request, random_str, authority):
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    user = User.objects.get(id=request.user.id)
    response = UserProject.objects.filter(project=project, user=user)
    if response.count() == 0:
        return get_response(ResponseType.ALREADY_IN_PROJECT)
    user_project = response[0]
    if user_project.authority != 'rw':
        return get_response(ResponseType.NO_AUTHORITY)
    response = Authorization.objects.filter(user=user, project=project)
    if authority == 'rw' and authority == 'r':
        return get_response(ResponseType.INVALID_AUTHORITY_CODE)
    if response.count() != 0:
        authorization = response[0]
        authorization.authority = authority
        authorization.save()
        return get_response(ResponseType.SUCCESS, response[0])
    else:
        authorization = Authorization(project=project, user=user, authority=authority)
        authorization.get_random_code()
        authorization.save()
        return get_response(ResponseType.SUCCESS, authority)


def authorize_user(request, code):
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    user = User.objects.get(id=request.user.id)
    response = Authorization.objects.filter(code=code)
    if response.count() == 0:
        return get_response(ResponseType.INVALID_AUTHORITY_CODE)
    authorization = response[0]
    response = UserProject.objects.filter(project=authorization.project, user=user)
    if response.count() != 0:
        return get_response(ResponseType.ALREADY_IN_PROJECT)
    user_project = UserProject(user=user, project=authorization.project, authority=authorization.authority)
    user_project.save()
    authorization.delete()
    return get_response(ResponseType.SUCCESS, user_project)


def get_current_users(request):
    return HttpResponse('get current users')


def get_user_projects(request):
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    user = User.objects.get(id=request.user.id)
    response = UserProject.objects.filter(user=user)
    lst = []
    for i in response:
        lst.append(i.get_dict())
    return get_response(ResponseType.SUCCESS, lst)


def get_versions(request, random_str, filename):
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    response = Document.objects.filter(project=project, filename=filename)
    if response.count() == 0:
        return get_response(ResponseType.DOCUMENT_NOT_FOUND)
    lst = []
    for i in response:
        lst.append(i.get_dict())
    return get_response(ResponseType.SUCCESS, json.dumps(lst))


def compare_versions(request, random_str, filename):
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    user = User.objects.get(id=request.user.id)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    response = Document.objects.filter(project=project, filename=filename)
    if response.count() == 0:
        return get_response(ResponseType.DOCUMENT_NOT_FOUND)
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
        return get_response(ResponseType.VERSION_NOT_FOUND, version_one)
    if document_two is None:
        return get_response(ResponseType.VERSION_NOT_FOUND, version_two)
    dmp = diff_match_patch()
    diffs = dmp.diff_main(text1=document_one.content, text2=document_two.content)
    dmp.diff_cleanupSemantic(diffs)
    return get_response(ResponseType.SUCCESS, json.dumps(diffs))


def create_version(request, random_str, filename):
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    project.create_version(filename)
    return get_response(ResponseType.SUCCESS, "Create version successfully!")


def rename_project(request, random_str):
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    user = User.objects.get(id=request.user.id)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    project.name = request.GET['name']
    project.save()
    return get_response(ResponseType.SUCCESS, "Rename successfully!")


def get_doc_info(request, random_str):
    filename = request.GET['filename']
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    response = Document.objects.filter(filename=filename, project=project).order_by('-version')
    if response.count() == 0:
        return get_response(ResponseType.DOCUMENT_NOT_FOUND)
    document = response[0]
    re = {
        "filename": document.filename,
        "last_modify": str(document.last_modify),
        "content": document.content,
        "version": document.version,
        "wb_version": document.wb_version,
    }
    return get_response(ResponseType.SUCCESS, json.dumps(re))


def get_latex_templates(request):
    path = os.path.join(BASE_DIR, 'static/LaTex')
    lst = []
    idx = 0
    c_idx = 0
    for i in os.listdir(path):
        temp_path = os.path.join(path, i)
        c_idx += 1
        re = {
            'category': i,
            'index': c_idx,
            'list': []
        }
        lst.append(re)
        for j in os.listdir(temp_path):
            tp = os.path.join(temp_path, j)
            tp = os.path.join(tp, 'reference.txt')
            f = open(tp, 'r')
            idx += 1
            re['list'].append({
                'title': j,
                'reference': f.readlines()[0],
                'index': idx
            })
    return get_response(ResponseType.SUCCESS, lst)


def delete_project(request, random_str):
    """Check user cookie first, remove project file from disk and
    then delete project from database.
    Only user who has read and write priority can delete the project.

    :param request: request from client
    :param random_str: a string identifies the project
    :return: ok response or error response
    """
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    user = User.objects.get(id=request.user.id)
    response = UserProject.objects.filter(user=user, project=project)
    if response.count() == 0:
        return get_response(ResponseType.NOT_IN_PROJECT)
    user_project = response[0]
    if user_project.authority != 'rw':
        return get_response(ResponseType.NO_AUTHORITY)
    project_path = os.path.join(BASE_DIR, "UserData/Projects")
    project_path = os.path.join(project_path, random_str)
    try:
        import shutil
        shutil.rmtree(project_path)
    except Exception as e:
        print(e)
        return get_response(ResponseType.DELETE_ERROR)
    project.delete()
    return get_response(ResponseType.SUCCESS, "Delete Project Successfully!")

