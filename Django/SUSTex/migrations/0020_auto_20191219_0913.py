# Generated by Django 2.2.7 on 2019-12-19 09:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SUSTex', '0019_auto_20191219_0908'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='last_modify',
            field=models.DateTimeField(auto_created=True),
        ),
    ]