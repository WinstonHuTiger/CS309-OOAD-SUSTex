# Generated by Django 2.2.7 on 2019-11-20 02:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0002_auto_20191120_1046'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='project_id',
        ),
    ]
