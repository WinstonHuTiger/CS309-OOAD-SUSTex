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
    path('login/github/', github_login.login),
    path('login/github/complete', github_login.complete),
    path('logout/', views.logout),
    path('user/', views.get_user_info),
    path('user/projects/', views.get_user_projects),
    path('project/create/', views.create_project),
    path('project/create/template/', file_operation.create_from_template),
    path('project/import/', file_operation.import_project),
    path('project/invite/', views.add_collaborator),
    path('project/authority/', views.change_authority),
    path('project/<str:random_str>/create/version/<str:filename>/', views.create_version),
    path('project/<str:random_str>/create/document/', views.create_doc),
    path('project/<str:random_str>/document/', views.get_doc_info),
    path('project/<str:random_str>/', views.get_project_info),
    path('project/<str:random_str>/create/file/', file_operation.create_file),
    path('project/<str:random_str>/create/path/', file_operation.create_path),
    path('project/<str:random_str>/upload/', file_operation.upload_file),
    path('project/<str:random_str>/download/file/', file_operation.download_file),
    path('project/<str:random_str>/delete/file/', file_operation.delete_file),
    path('project/<str:random_str>/compile/', file_operation.compile_pdf),
    path('project/<str:random_str>/rename/path/', file_operation.rename_path),
    path('project/<str:random_str>/rename/file/', file_operation.rename_file),
    path('project/<str:random_str>/rename/path/', file_operation.rename_path),
    path('project/<str:random_str>/<str:filename>/versions/compare/', views.compare_versions),
    path('project/<str:random_str>/<str:filename>/versions/', views.get_versions),
    path('project/<str:random_str>/<str:filename>/versions/create/', views.create_version),
    path('project/<str:random_str>/rename/', views.rename_project),
    path('templates/latex/', views.get_latex_templates),
    path('project/<str:random_str>/download/', file_operation.download_project),
    path('project/<str:random_str>/delete/', views.delete_project),
    path('user/search/', views.search_user),
    path('user/invitation/', views.handel_invitation)
]
