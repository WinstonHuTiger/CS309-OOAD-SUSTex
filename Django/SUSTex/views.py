from django.contrib.auth.decorators import login_required
from django.contrib import auth
from django.http import HttpResponse
from SUSTex.models import User, Project, Document


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


def create_project(request):
    project = Project(name='test', type='LaTex')
    project.generate_random_str()
    project.create_project_path()
    project.save()
    project.create_document()
    return HttpResponse(project)


def get_projects(request):
    return HttpResponse('Get projects')


def get_files(request):
    return HttpResponse('Get files')


def create_file(request):
    return HttpResponse('Create files')


def edit_doc(request):
    return HttpResponse('Edit doc')


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
