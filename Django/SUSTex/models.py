from django.db import models
from django.contrib.auth.models import AbstractUser
import json
import os
import random
import string

MAX_VERSION_NUM = 5
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUPPORT_IMAGE_TYPE = ['eps', 'jpg', 'png', 'tiff']

# Create your models here.


# https://www.cnblogs.com/renfanzi/p/8243777.html
def list_dir(path, res):
    for i in os.listdir(path):
        temp_dir = os.path.join(path, i)
        if os.path.isdir(temp_dir):
            temp = {"dirname": i, "child_dirs": [], "files": []}
            res['child_dirs'].append(list_dir(temp_dir, temp))
        else:
            _type = 'unknown'
            postfix = i.split('.')[-1]
            if postfix == 'tex':
                _type = 'LaTex'
            elif postfix == 'md':
                _type = 'Markdown'
            elif postfix in SUPPORT_IMAGE_TYPE:
                _type = 'Image'
            elif postfix == 'pdf':
                _type = 'PDF'
            file = {"filename": i, "type": _type}
            res['files'].append(file)
    return res


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
    random_str = models.CharField(max_length=30, null=False, default='####################', unique=True)
    name = models.CharField(max_length=50, null=True)
    type = models.CharField(max_length=4, default='latex', null=False)

    def generate_random_str(self):
        self.random_str = ''.join(random.sample(string.ascii_letters + string.digits, 30))
        if Project.objects.filter(random_str=self.random_str).count() != 0:
            self.generate_random_str()

    def __str__(self):
        data = {'id': self.id, 'random_str': self.random_str, 'name': self.name, 'type':self.type}
        return get_json(data)

    def create_project_path(self):
        path = os.path.join(BASE_DIR, 'UserData/Projects/%s' % self.random_str)
        is_exists = os.path.isdir(path)
        if is_exists:
            print("Folder already exits.")
        else:
            os.makedirs(path)
            print("Create project folder successfully.")
        return path

    def create_document(self, filename=None):
        if filename is None:
            filename = 'main'
        query_doc = Document.objects.filter(project_id=self.id, filename=filename)
        versions = query_doc.count()
        if versions != 0:
            raise RuntimeError('Document already created!')
        document = Document(project_id=self.id, filename=filename, version=1)
        document.project = self
        document.save()
        path = os.path.join(BASE_DIR, 'UserData/Projects/%s' % self.random_str)
        if self.type == 'LaTex':
            f = open(os.path.join(path, '%s.tex' % filename), 'w+')
        else:
            f = open(os.path.join(path, '%s.md' % filename), 'w+')
        f.close()

    def create_version(self, filename=None):
        if filename is None:
            filename = 'main'
        query_doc = Document.objects.filter(project_id=self.id, filename=filename)
        versions = query_doc.count()
        if versions >= MAX_VERSION_NUM:
            raise RuntimeError('Cannot create more than five versions for one document.')
        elif versions == 0:
            raise RuntimeError('Document does not exist!')
        document = Document(project_id=self.id, filename=filename, version=versions+1)
        document.project = self
        document.save()
        # replace content here

    def get_info(self):
        path = os.path.join(BASE_DIR, 'UserData/Projects/%s' % self.random_str)
        res = {'dirname': 'root', 'child_dirs': [], 'files': []}
        list_dir(path, res)
        res['random_str'] = self.random_str
        res['user_info'] = self.get_users()
        return get_json(res)

    def get_users(self):
        response = UserProject.objects.filter(project=self)
        lst = []
        for i in response:
            lst.append({"user": i.user.id, "authority": i.authority})
        data = {'users': lst}
        return data


class UserProject(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    authority = models.CharField(max_length=2, default='rw', null=False)

    def __str__(self):
        data = {'project': self.project.id, 'user': self.user.id, 'authority': self.authority}
        return get_json(data)


class Document(models.Model):
    id = models.AutoField(primary_key=True)
    project = models.ForeignKey('Project', on_delete=models.CASCADE)
    filename = models.CharField(max_length=50, null=False)
    version = models.IntegerField(default=0)
    date = models.DateField(auto_now=True)

    def __str__(self):
        data = {'id': self.id, 'project': self.project, 'version': self.version}
        return get_json(data)
