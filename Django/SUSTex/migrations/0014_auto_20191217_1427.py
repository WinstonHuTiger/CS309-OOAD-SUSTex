# Generated by Django 2.2.7 on 2019-12-17 06:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SUSTex', '0013_auto_20191217_1420'),
    ]

    operations = [
        migrations.AlterField(
            model_name='authorization',
            name='date',
            field=models.DateField(auto_now=True),
        ),
    ]