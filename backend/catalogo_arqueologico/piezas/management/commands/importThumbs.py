from django.core.management.base import BaseCommand, CommandParser
from django.db import IntegrityError
from django.core.files import File
from django.conf import settings
from piezas.models import Thumbnail
import csv
import os

class Command(BaseCommand):
    help = 'add new data from csv to Metadata Table'

    def add_arguments(self, parser):
        parser.add_argument('thumbFolder', type=str)

    def handle(self, *args, **kwargs):
        folder_path = os.path.join(settings.BASE_DIR, kwargs.get('thumbFolder'))

        if not os.path.exists(folder_path):
            self.stdout.write(self.style.ERROR(f'Directory {folder_path} does not exist'))
            return

        thumb_files = os.listdir(folder_path)
        print(thumb_files)

        for thumb_name in thumb_files:
            thumb_path = os.path.join(folder_path, thumb_name)
            print(thumb_path)
            with open(thumb_path, 'rb') as thumbnail:
                print(thumbnail)
                new_thumb = Thumbnail(
                    path=File(thumbnail, name=thumb_name),   
                )
                new_thumb.save()
