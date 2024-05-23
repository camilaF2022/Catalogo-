from django.core.management.base import BaseCommand, CommandParser
from django.db import IntegrityError
from django.core.files import File
from django.conf import settings
from piezas.models import Image
import re
import os

class Command(BaseCommand):
    help = 'add new data from csv to Metadata Table'

    def add_arguments(self, parser):
        parser.add_argument('multimediaFolder', type=str)

    def handle(self, *args, **kwargs):
        multimedia_path = os.path.join(settings.BASE_DIR, kwargs.get('multimediaFolder'))

        if not os.path.exists(multimedia_path):
            self.stdout.write(self.style.ERROR(f'Directory {multimedia_path} does not exist'))
            return

        image_files = os.listdir(multimedia_path)
        print(image_files)

        for image_name in image_files:
            image_path = os.path.join(multimedia_path, image_name)
            parts = re.split(r'[._]', image_name)
            if 'pat' in parts or 'flat' in parts or 'thumb' in parts:
                with open(image_path, 'rb') as image:
                    print(image)
                    new_image = Image(
                        id_artifact = int(parts[0]),
                        path = File(image, name=image_name)
                    )
                    new_image.save()
