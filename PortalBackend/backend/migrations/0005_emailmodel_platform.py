# Generated by Django 3.0.5 on 2020-12-03 18:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0004_auto_20201201_1809'),
    ]

    operations = [
        migrations.AddField(
            model_name='emailmodel',
            name='platform',
            field=models.CharField(default='none', max_length=255),
        ),
    ]