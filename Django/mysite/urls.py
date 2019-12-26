"""mysite URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from SUSTex.views.login import github_login
from SUSTex.views import file_operation, views


urlpatterns = [
    # redirect to github auth login interface
    path('login/github/', github_login.login),
    # <database> retrieve user info from github
    path('login/github/complete', github_login.complete),
    # logout from github
    path('logout/', views.logout),
    # <database> get user info from database
    path('user/', views.get_user_info),
    # <database> get user project list from database
    path('user/projects/', views.get_user_projects),
    # <database> create project, add record to database
    path('project/create/', views.create_project),
    # <database> create project from given template, add record to database
    path('project/create/template/', file_operation.create_from_template),
    # <database> create project from uploaded .zip file, add record to database
    path('project/import/', file_operation.import_project),
    # <database> add list of collaborators to a project in the database
    path('project/invite/', views.add_collaborator),
    # <database> change authority of list of users to a project in the database
    path('project/authority/', views.change_authority),
    # <database> get project info from database
    path('project/<str:random_str>/', views.get_project_info),
    # <database> add version record to a project in the database
    path('project/<str:random_str>/create/version/<str:filename>/', views.create_version),
    # <database> add file record of a project in the database
    path('project/<str:random_str>/create/document/', views.create_doc),
    # <database> get file info (filename, last_modify, content, version) from database
    path('project/<str:random_str>/document/', views.get_doc_info),
    # <disc> create file to a project directory
    path('project/<str:random_str>/create/file/', file_operation.create_file),
    # <disc> create a folder in the file system
    path('project/<str:random_str>/create/path/', file_operation.create_path),
    # <disc> upload a file to a project directory
    path('project/<str:random_str>/upload/', file_operation.upload_file),
    # <disc> download a file to a project directory
    path('project/<str:random_str>/download/file/', file_operation.download_file),
    # <disc> delete a file from a project directory
    path('project/<str:random_str>/delete/file/', file_operation.delete_file),
    # <disc> delete folder/folders from a project directory
    path('project/<str:random_str>/delete/path/', file_operation.delete_path),
    # <disc> compile .tex file, add .pdf to the project directory
    path('project/<str:random_str>/compile/', file_operation.compile_pdf),
    # <disc> move file
    path('project/<str:random_str>/rename/path/', file_operation.rename_path),
    # <disc> rename file
    path('project/<str:random_str>/rename/file/', file_operation.rename_file),
    # REDUNDANT, CHECK
    path('project/<str:random_str>/rename/path/', file_operation.rename_path),
    # <database> show the differences between two files
    path('project/<str:random_str>/<str:filename>/versions/compare/', views.compare_versions),
    # <database> get version lists
    path('project/<str:random_str>/<str:filename>/versions/', views.get_versions),
    # REDUNDANT, CHECK
    path('project/<str:random_str>/<str:filename>/versions/create/', views.create_version),
    # <database> rename project in database
    path('project/<str:random_str>/rename/', views.rename_project),
    # <database> get list of latex templates info
    path('templates/latex/', views.get_latex_templates),
    # <disc> download .zip file of the whole project directory
    path('project/<str:random_str>/download/', file_operation.download_project),
    # <disc><database> delete the project from database and from disc
    path('project/<str:random_str>/delete/', views.delete_project),
    # <database> get list of users
    path('user/search/', views.search_user),
    # <database> invite users to a project
    path('user/invitation/', views.handel_invitation),
    path('project/<str:random_str>/attribute/path/', file_operation.get_path_attribute),
    path('project/<str:random_str>/attribute/file/', file_operation.get_path_attribute)
]
