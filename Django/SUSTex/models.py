from django.db import models
from django.contrib.auth.models import AbstractUser
import json
import os

# Create your models here.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def get_json(data: dict):
    return json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, null=True, unique=True)
    password = models.CharField(max_length=50, null=True)
    github_id = models.IntegerField(null=True)
    alias = models.CharField(max_length=20, null=False)
    avatar_url = models.CharField(max_length=500, null=True)

    def __str__(self):
        data = {'id': self.id, 'alias': self.alias, 'username': self.username, 'password': self.password,
                'github_id': self.github_id, 'avatar_url': self.avatar_url}
        return get_json(data)


class Project(models.Model):
    id = models.AutoField(primary_key=True)
    random_str = models.CharField(max_length=20, null=False, default='####################')
    name = models.CharField(max_length=50, null=True)
    type = models.CharField(max_length=4, default='latex', null=False)

    def __str__(self):
        data = {'id': self.id, 'random_str': self.random_str, 'name': self.name, 'type':self.type}
        return get_json(data)

    def create_project_path(self):
        path = os.path.join(BASE_DIR, 'UserData/Projects/%s' % self.random_str)
        print(path)
        is_exists = os.path.isdir(path)
        if is_exists:
            print("Folder already exits.")
        else:
            os.makedirs(path)
            print("Create project folder successfully.")


class UserProject(models.Model):
    project_id = models.ForeignKey('Project', on_delete=models.CASCADE)
    user_id = models.ForeignKey('User', on_delete=models.CASCADE)
    authority = models.CharField(max_length=2, default='rw', null=False)

    def __str__(self):
        data = {'project_id': self.project_id, 'user_id': self.user_id, 'authority': self.authority}
        return get_json(data)


class Document(models.Model):
    id = models.AutoField(primary_key=True)
    project_id = models.ForeignKey('Project', on_delete=models.CASCADE)
    title = models.CharField(max_length=50, null=False)
    version = models.IntegerField(default=0)
    date = models.DateField(auto_now=True)

    def __str__(self):
        data = {'id': self.id, 'project_id': self.project_id, 'version': self.version}
        return get_json(data)

