from django.contrib.auth.decorators import login_required
from django.contrib import auth
from django.http import HttpResponse, FileResponse
from SUSTex.models import User, Project, Document, UserProject, DocumentChange, Invitation, AuthorityChange
from Utils.diff_match_patch import diff_match_patch
import json
import os
from enum import Enum, unique
# from file_operation import ALLOWED_POSTFIX

BASE_DIR = os.path.abspath(os.path.join(os.path.join(os.path.dirname(os.path.abspath(__file__)), os.path.pardir), os.path.pardir))
ALLOWED_POSTFIX = ['tex', 'bib', 'txt', 'md']

@unique
class ResponseType(Enum):
    SUCCESS = 1
    NOT_AUTHENTICATED = 2
    PROJECT_NOT_FOUND = 3
    NOT_IN_PROJECT = 4
    NO_AUTHORITY = 5
    INVALID_AUTHORITY = 6
    ALREADY_IN_PROJECT = 7
    DOCUMENT_NOT_FOUND = 8
    VERSION_NOT_FOUND = 9
    FILE_CORRUPTED = 10
    DELETE_ERROR = 11
    USER_NOT_FOUND = 12
    FILE_OPEN_ERROR = 13


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
    elif res_type == ResponseType.PROJECT_NOT_FOUND:
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
    elif res_type == ResponseType.INVALID_AUTHORITY:
        return HttpResponse(json.dumps({
            "type": "error",
            "code": ResponseType.INVALID_AUTHORITY.value,
            "message": "Invalid authority."
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
    elif res_type == ResponseType.USER_NOT_FOUND:
        return HttpResponse(json.dumps({
            "type": "error",
            "code": ResponseType.USER_NOT_FOUND.value,
            "message": "User not found."
        }))


# Create your views here.
def logout(request):
    auth.logout(request)
    return get_response(ResponseType.SUCCESS, "Logout successfully!")


def get_user_info(request):
    '''Check user cookie first,
    then retrieve user's info

    :param request: request from client
    :return: user's info in dictionary or error response
    '''
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    user = User.objects.get(id=request.user.id)
    return get_response(ResponseType.SUCCESS, user.get_dict())


def create_project(request):
    '''Check user cookie first,
    then create an object respectively in Project and
    UserProject table

    :param request: request from client
    :return: the created project info or error response
    '''
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
    '''Check user cookie first, check the requested project exist,
    check if the type of file is permitted,
    then create a document in project

    :param request: request from client
    :param random_str: indicator of a project
    :return: success response or error response
    '''
    filename = request.GET['filename']
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    lst = filename.split('.')
    if len(lst) == 1:
        return get_response(ResponseType.FILE_CORRUPTED, 'You cannot create a file without a postfix')
    postfix = lst[-1]
    if postfix not in ALLOWED_POSTFIX:
        return get_response(ResponseType.FILE_CORRUPTED, 'File postfix not allowed')
    project = response[0]
    project.create_document(filename)
    return get_response(ResponseType.SUCCESS, "Create document successfully!")


def get_project_info(request, random_str):
    '''Check user cookie first, check the requested project exist,
    then return basic info of the project

    :param request: request from client
    :param random_str: indicator of a project
    :return: basic info of the project or error response
    '''
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    info = project.get_info()
    return get_response(ResponseType.SUCCESS, info)


def get_user_projects(request):
    '''Check user cookie first,
    then return a list of the users' projects

    :param request: request from client
    :return: a list of the users' projects or error response
    '''
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    user = User.objects.get(id=request.user.id)
    response = UserProject.objects.filter(user=user)
    lst = []
    for i in response:
        lst.append(i.get_dict())
    return get_response(ResponseType.SUCCESS, lst)


def get_versions(request, random_str, filename):
    '''Check user cookie first, check the requested project exist,
    check file is in the project,
    then return a list of versions

    :param request: request from client
    :param random_str: indicator of a project
    :param filename: requested filename
    :return: a list of versions or error response
    '''
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
    '''Check user cookie first, check the requested project exist,
    check file is in the project, check if requested version existed,
    then compare and return the differences in .json

    :param request: request from client
    :param random_str: indicator of a project
    :param filename: requested filename
    :return: the differences in .json or error response
    '''
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
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
    '''Check user cookie first, check project and file exists,
    check file is in the project,
    then create a version of file in the project item

    :param request: request from client
    :param random_str: indicator of a project
    :param filename: requested filename
    :return: success response or error response
    '''
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    response = Document.objects.filter(filename=filename, project=project)
    if response.count() == 0:
        return get_response(ResponseType.DOCUMENT_NOT_FOUND)
    project.create_version(filename)
    return get_response(ResponseType.SUCCESS, "Create version successfully!")


def rename_project(request, random_str):
    '''Check user cookie first, check the requested project exists,
    change the name of project item

    :param request: request from client
    :param random_str: indicator of a project
    :return: success response or error response
    '''
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    response = UserProject.objects.filter(project=project, user=User.objects.get(id=request.user.id))
    if response.count() == 0 or response[0].type == "Member":
        return get_response(ResponseType.INVALID_AUTHORITY)
    project.name = request.GET['name']
    project.save()
    return get_response(ResponseType.SUCCESS, "Rename successfully!")


def get_doc_info(request, random_str):
    '''Check user cookie first, check the requested project exists,
    check file is in the project,
    then collect and return basic info from the latest version

    :param request: request from client
    :param random_str: indicator of a project
    :return: basic info of a file (filename, last_modify, content, version)
    '''
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
    '''Open latex templates directory on the disc,
    go through all the subdirectories and collect templates' info
    and return a list of templates with their info

    :param request: request from client
    :return: a list of templates with their info
    '''
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
            idx += 1
            try:
                f = open(tp, 'r')
            except OSError:
                return get_response(ResponseType.FILE_OPEN_ERROR)
            with f:
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
    if user_project.authority != 'rw' or user_project.type == "Member":
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


def search_user(request):
    '''Check user cookie first, check the requested project exist,
    then find requested users' ids and return a list of users
    with their basic info

    :param request: request from client
    :return: list of users with their basic info
    '''
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    random_id = request.GET["user"]
    random_str = request.GET["project"]
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    if random_id == "":
        return get_response(ResponseType.SUCCESS, [])
    response = User.objects.filter(random_id__regex=r'^%s[0-9]*$' % random_id)
    re = []
    for i in response:
        response_ = UserProject.objects.filter(project=project, user=i)
        if response_.count() == 0:
            item = {
                "random_id": i.random_id,
                "alias": i.alias,
                "avatar_url": i.avatar_url
            }
            re.append(item)
    return get_response(ResponseType.SUCCESS, re)


def add_collaborator(request):
    '''Check user cookie first, check the requested project exist,
    check user to invite exist and not have access to the project
    or be invited yet,
    then create invitation object in the database

    :param request: request from client
    :return: success response with invitation sending info or error response
    '''
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    users = json.loads(request.GET["users"])
    random_str = request.GET["project"]
    admin = User.objects.get(id=request.user.id)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    response = UserProject.objects.filter(project=project, user=admin)
    if response.count() == 0 or response[0].type == "Member":
        return get_response(ResponseType.INVALID_AUTHORITY)
    not_found = []
    success = []
    already_in = []
    for i in users:
        response = User.objects.filter(random_id=i["id"])
        if response.count() == 0:
            not_found.append(i)
            break
        user = response[0]
        if i["authority"] != 'rw' and i["authority"] != 'r':
            return get_response(ResponseType.INVALID_AUTHORITY)
        response = UserProject.objects.filter(user=user, project=project)
        if response.count() != 0:
            already_in.append(i)
            break
        response = Invitation.objects.filter(user=user, project=project)
        if response.count() != 0:
            for j in response:
                j.delete()
        Invitation(admin=admin, user=user, project=project, authority=i["authority"]).save()
        success.append(i)
    re = {
        "not_found": not_found,
        "success": success,
        "already_in": already_in
    }
    return get_response(ResponseType.SUCCESS, re)


def handel_invitation(request):
    '''Check user cookie first, check that user and invitation is matched,
    check if user accepts invitation,
    if so then add an item of user and project into UserProject table,
    then delete invitation item

    :param request:
    :return: success response or error response
    '''
    _id = request.GET['id']
    action = request.GET["action"]
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    user = User.objects.get(id=request.user.id)
    invitation = Invitation.objects.get(id=_id)
    if invitation.user != user:
        return get_response(ResponseType.NO_AUTHORITY)
    if action == "accept":
        UserProject(project=invitation.project, user=user, authority=invitation.authority).save()
    invitation.delete()
    return get_response(ResponseType.SUCCESS, "Success!")


def change_authority(request):
    '''Check user cookie first, check project and users exist,
    check that users are in project,
    if 'remove', delete item in UserProject table
    else refresh authority

    :param request:
    :return: success response or error response
    '''
    print(request.GET)
    random_str = request.GET["project"]
    users = json.loads(request.GET["users"])
    if not request.user.is_authenticated:
        return get_response(ResponseType.NOT_AUTHENTICATED)
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return get_response(ResponseType.PROJECT_NOT_FOUND)
    project = response[0]
    admin = User.objects.get(id=request.user.id)
    response = UserProject.objects.filter(project=project, user=admin)
    if response.count() == 0 or response[0].type == "Member":
        return get_response(ResponseType.INVALID_AUTHORITY)
    for i in users:
        random_id = i["id"]
        authority = i["authority"]
        response = User.objects.filter(random_id=random_id)
        if response.count() == 0:
            return get_response(ResponseType.USER_NOT_FOUND)
        user = response[0]
        if user.id == admin.id:
            print("HERE")
            continue
        response = UserProject.objects.filter(project=project, user=user)
        if response.count() == 0:
            return get_response(ResponseType.NOT_IN_PROJECT)
        user_project = response[0]
        if authority == "remove":
            user_project.delete()
        else:
            user_project.authority = authority
            user_project.save()
    return get_response(ResponseType.SUCCESS, "Change authority successfully!")