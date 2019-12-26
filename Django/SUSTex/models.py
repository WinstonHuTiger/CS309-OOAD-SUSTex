from django.db import models
from django.contrib.auth.models import AbstractUser
import json
import os
import random
import string
import time

MAX_VERSION_NUM = 5
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUPPORT_IMAGE_TYPE = ['eps', 'jpg', 'png', 'tiff']

# Create your models here.


# https://www.cnblogs.com/renfanzi/p/8243777.html
def list_dir(path, res):
    for i in os.listdir(path):
        temp_dir = os.path.join(path, i)
        if os.path.isdir(temp_dir):
            temp = {"dirname": i, "child_dirs": [], "files": [], "path": os.path.join(res["path"], i)}
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
            elif postfix == 'txt':
                _type = 'Text'
            elif postfix == "zip":
                _type = "Zip"
            elif postfix == "bib":
                _type = "Bib"
            mtime = os.stat(temp_dir).st_mtime
            file_modify_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(mtime))
            file = {"filename": i, "type": _type, 'last_modify': file_modify_time}
            res['files'].append(file)
    return res


def get_json(data: dict):
    return json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    random_id = models.IntegerField(unique=True, null=True)
    username = models.CharField(max_length=50, null=True, unique=True)
    password = models.CharField(max_length=50, null=True)
    github_id = models.IntegerField(null=True, db_index=True)
    alias = models.CharField(max_length=20, null=False)
    avatar_url = models.CharField(max_length=500, null=True)

    def __str__(self):
        return get_json(self.get_dict())

    def get_dict(self):
        responses = Invitation.objects.filter(user=self)
        lst = []
        for i in responses:
            lst.append(i.get_dict())
        data = {'random_id': self.random_id, 'alias': self.alias, 'username': self.username,
                'password': self.password, 'github_id': self.github_id,
                'avatar_url': self.avatar_url, 'invitations': lst}
        return data

    def generate_random_id(self):
        arr = [str(random.randint(1, 9))]
        arr.extend(random.sample('0123456789', 7))
        self.random_id = int("".join(arr))
        response = User.objects.filter(random_id=self.random_id)
        if response.count() != 0:
            self.generate_random_id()


class Project(models.Model):
    id = models.AutoField(primary_key=True)
    creator = models.ForeignKey('User', on_delete=models.CASCADE, null=True)
    random_str = models.CharField(max_length=30, null=False, default='####################', unique=True)
    name = models.CharField(max_length=50, null=True)
    last_modify = models.DateTimeField(auto_now=True)
    template = models.CharField(max_length=50, null=True)

    def generate_random_str(self):
        self.random_str = ''.join(random.sample(string.ascii_letters + string.digits, 30))
        if Project.objects.filter(random_str=self.random_str).count() != 0:
            self.generate_random_str()

    def __str__(self):
        data = {'id': self.id, 'random_str': self.random_str, 'name': self.name,
                "last_modify": str(self.last_modify)}
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
            filename = 'main.tex'
        query_doc = Document.objects.filter(project_id=self.id, filename=filename)
        versions = query_doc.count()
        if versions != 0:
            return
        document = Document(project=self, filename=filename)
        document.project = self
        document.save()
        path = os.path.join(BASE_DIR, 'UserData/Projects/%s' % self.random_str)
        f = open(os.path.join(path, filename), 'w+')
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
        document = Document(project=self, filename=filename, version=versions+1)
        document.project = self
        document.save()
        # replace content here

    def get_info(self):
        path = os.path.join(BASE_DIR, 'UserData/Projects/%s' % self.random_str)
        res = {'child_dirs': [], 'files': [], 'path': ''}
        list_dir(path, res)
        re = {
            'name': self.name,
            'random_str': self.random_str,
            'files': res
        }
        return re

    def get_users(self):
        lst = []
        creator = UserProject.objects.get(project=self, type="Creator")
        lst.append({"id": creator.user.random_id, "alias": creator.user.alias, "authority": creator.authority,
                    "type": "Creator", "avatar_url": creator.user.avatar_url})
        response = UserProject.objects.filter(project=self, type="Member")
        for i in response:
            lst.append({"id": i.user.random_id, "alias": i.user.alias, "authority": i.authority,
                        "type": i.type, "avatar_url": i.user.avatar_url})
        return lst


class UserProject(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    authority = models.CharField(max_length=2, default='rw', null=False)
    type = models.CharField(max_length=10, null=False, default="Member")

    class Meta:
        unique_together = ('project', 'user')

    def __str__(self):
        data = {'project': self.project.id, 'user': self.user.id, 'authority': self.authority}
        return get_json(data)

    def get_dict(self):
        print("HERE")
        return {"name": self.project.name, "project": self.project.random_str, "authority": self.authority,
                "last_modify": str(self.project.last_modify),
                "users": self.project.get_users()}


class Document(models.Model):
    id = models.AutoField(primary_key=True)
    filename = models.CharField(max_length=50, default="main.tex")
    project = models.ForeignKey('Project', on_delete=models.CASCADE, unique=True)
    version = models.IntegerField(default=0, db_index=True)
    wb_version = models.IntegerField(default=0, db_index=True)
    last_modify = models.DateTimeField(auto_now=True)
    content = models.TextField(default='')

    def __str__(self):
        data = {'id': self.id, 'project': self.project.random_str, 'version': self.version}
        return get_json(data)

    def get_dict(self):
        return {"project": self.project.random_str, "version": self.version, "last_modify": str(self.last_modify)}


class Invitation(models.Model):
    id = models.IntegerField(primary_key=True)
    project = models.ForeignKey('Project', on_delete=models.CASCADE, null=True)
    admin = models.ForeignKey('User', on_delete=models.CASCADE, related_name='I_admin')
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='I_user')
    date = models.DateTimeField(auto_now=True)
    authority = models.CharField(max_length=2, default='rw', null=False)
    accept = models.CharField(max_length=6, default="wait")

    def __str__(self):
        return get_json(self.get_dict())

    def get_dict(self):
        data = {'id': self.id, 'project': self.project.name, 'admin': self.admin.alias, 'admin_avatar': self.admin.avatar_url,
                'authority': self.authority, 'random_str': self.project.random_str}
        return data


class AuthorityChange(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE, null=True)
    admin = models.ForeignKey('User', on_delete=models.CASCADE, related_name='A_admin')
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='A_user')
    date = models.DateTimeField(auto_now=True)
    change = models.CharField(max_length=2, default="rm", null=False)


class DocumentChange(models.Model):
    document = models.ForeignKey('Document', on_delete=models.CASCADE)
    version = models.IntegerField(default=0, db_index=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True, db_index=True)
    parent_version = models.IntegerField(default=0, db_index=True)
    data = models.TextField()

    class Meta:
        unique_together = (
            ('document', 'version'),
            ('document', 'user', 'parent_version'),
        )

    def get_dict(self):
        out = {
            'version': self.version,
            'time': self.time.isoformat(),
            'op': json.loads(self.data)
        }
        return out
