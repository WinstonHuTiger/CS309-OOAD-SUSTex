# Generated by Django 2.2.7 on 2019-12-17 06:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('SUSTex', '0011_auto_20191217_1406'),
    ]

    operations = [
        migrations.CreateModel(
            name='Authorization',
            fields=[
                ('date', models.DateField(auto_created=True)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('code', models.CharField(max_length=30, unique=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]