# Generated by Django 2.2.7 on 2019-12-25 15:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SUSTex', '0006_auto_20191225_1304'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invitation',
            name='id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]
