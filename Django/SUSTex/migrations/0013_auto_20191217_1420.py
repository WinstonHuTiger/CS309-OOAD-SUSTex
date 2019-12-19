# Generated by Django 2.2.7 on 2019-12-17 06:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('SUSTex', '0012_authorization'),
    ]

    operations = [
        migrations.AddField(
            model_name='authorization',
            name='project',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='SUSTex.Project'),
        ),
        migrations.AlterField(
            model_name='authorization',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]