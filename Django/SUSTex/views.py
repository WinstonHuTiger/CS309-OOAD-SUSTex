from django.contrib.auth.decorators import login_required
from django.contrib import auth
from django.http import HttpResponse
from SUSTex.models import User, Project, Document, UserProject
import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Create your views here.
def logout(request):
    auth.logout(request)
    return HttpResponse('Logout!')


@login_required(login_url='/login/github/')
def get_user_info(request):
    user = User.objects.get(id=request.user.id)
    return HttpResponse(user)


def upload_file(request):
    return HttpResponse('Upload file')


def create_project(request, project_name):
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


def create_file(request):
    return HttpResponse('Create files')


def get_all_versions(request):
    return HttpResponse('Get all versions')


def compare_version(request):
    return HttpResponse('Compare version')


def edit_doc(request, random_str, filename):
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project does not exist!')
    project = response[0]
    response = Document.objects.filter(project=project, filename=filename).order_by('version')
    print(response[0].version)
    print(response[1].version)
    return HttpResponse('Edit File')


def create_doc(request, random_str, filename):
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project does not exist!')
    project = response[0]
    project.create_document(filename)
    return HttpResponse('Create document successfully.')


def create_version(request, random_str, filename):
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project does not exist!')
    project = response[0]
    project.create_version(filename)
    return HttpResponse('Create version.')


def get_project_info(request, random_str):
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project does not exist!')
    project = response[0]
    info = project.get_info()
    return HttpResponse(info)


def authorize_to_other(request, random_str):
    if not request.user.is_authenticated:
        return HttpResponse('Not login yet, please login first.')
    response = Project.objects.filter(random_str=random_str)
    if response.count() == 0:
        return HttpResponse('Project does not exist!')
    proje
    user = User.objects.get(id=request.user.id)
    user_project = UserProject.objects.filter(project=)


def authorize_user(request, random_str, authorize_code):
    return

