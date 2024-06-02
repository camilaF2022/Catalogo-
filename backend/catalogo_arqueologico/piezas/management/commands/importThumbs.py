from django.core.management.base import BaseCommand, CommandParser
from django.db import IntegrityError
from django.core.files import File
from django.conf import settings
from piezas.models import Thumbnail
import os
import logging

logger = logging.getLogger(__name__)
logger.setLevel("INFO")

class Command(BaseCommand):
    help = 'Import thumbnails from a folder. The folder must contain photo type files.'

    def handle(self, *args, **kwargs):
        thumb_folder = settings.THUMBNAILS_FOLDER_PATH
        if not os.path.exists(thumb_folder):
            logger.error(f"Folder {thumb_folder} not found. Stop")
            return

        thumb_files = os.listdir(thumb_folder)
        for thumb_name in thumb_files:
            thumb_path = os.path.join(thumb_folder, thumb_name)
            with open(thumb_path, 'rb') as thumbnail:
                try:
                    new_thumb = Thumbnail(
                        path=File(thumbnail, name=thumb_name),   
                    )
                    new_thumb.save()
                    logger.info(f"Thumbnail {thumb_name} added successfully")
                except IntegrityError:
                    logger.warning(f"Thumbnail {thumb_name} already exists. Skipping its creation")
                    continue
