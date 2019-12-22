from django.contrib.auth.decorators import login_required
from django.contrib import auth
from django.http import HttpResponse
from SUSTex.models import User, Project, Document, UserProject, Authorization, DocumentChange
from Utils.diff_match_patch import diff_match_patch
from django.contrib.auth import SESSION_KEY
from django.shortcuts import render
from django.urls import reverse
import json


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
    project = Project(name=project_name)
    project.generate_random_str()
    project.create_project_path()
    project.save()
    project.create_document()
    user_project = UserProject(project=project, user=user)
    user_project.save()
    re = {'project': json.loads(project.__str__()), 'user_project': json.loads(user_project.__str__())}
    return HttpResponse(json.dumps(re))


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


def edit_doc(request, random_str, filename):
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project does not exist!')
    project = response[0]
    response = Document.objects.filter(project=project, filename=filename).order_by('version')
    print(response[0].version)
    print(response[1].version)
    return HttpResponse('Edit File')


def get_doc_info(request, random_str):
    filename = request.GET['filename']
    if not request.user.is_authenticated:
        return HttpResponse('Please login first')
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project does not exist')
    project = response[0]
    response = Document.objects.filter(filename=filename, project=project).order_by('-version')
    if response.count() == 0:
        return HttpResponse('Document dose not exist')
    document = response[0]
    re = {
        "filename": document.filename,
        "last_modify": str(document.last_modify),
        "content": document.content,
        "version": document.version,
        "wb_version": document.wb_version,
    }
    return HttpResponse(json.dumps(re))
