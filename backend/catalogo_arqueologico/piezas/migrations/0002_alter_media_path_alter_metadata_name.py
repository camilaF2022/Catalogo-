# Generated by Django 4.2.13 on 2024-05-13 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('piezas', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='media',
            name='path',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='metadata',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
