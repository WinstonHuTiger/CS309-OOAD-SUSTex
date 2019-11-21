from django.urls import path
from django.conf.urls import *
from . import project_file_manage

urlpatterns = [
    # url(r'^compile-latex$', project_file_manage.compile_latex),
    url(r'^pdf$', project_file_manage.compile_pdf),
    url(r'^save-file$', project_file_manage.save_file),
    url(r'^load-file$', project_file_manage.load_file),
]