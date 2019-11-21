# models.py
from django.db import models


class User(models.Model):
    name = models.CharField(max_length=100)
    avatar_url = models.CharField(max_length=300)
