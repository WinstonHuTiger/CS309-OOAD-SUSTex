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
from SUSTex import views
from SUSTex import github_login


urlpatterns = [
    path('login/github/', github_login.login),
    path('login/github/complete', github_login.complete),
    path('testlogin/', github_login.test_login),
    path('logout/', views.logout),
    path('user/', views.get_user_info),
    path('project/create/', views.create_project),
    path('project/<str:random_str>/create/version/<str:filename>', views.create_version),
    path('project/<str:random_str>/edit/<str:filename>', views.edit_doc),
    path('project/<str:random_str>/create/document/<str:filename>', views.create_doc),
]
