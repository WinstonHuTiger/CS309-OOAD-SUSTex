# Generated by Django 2.2.7 on 2019-12-19 08:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SUSTex', '0017_document_content'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='last_modify',
            field=models.DateTimeField(auto_now=True),
        ),
    ]