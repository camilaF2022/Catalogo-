import os
from django.core.management.base import BaseCommand, CommandParser
from django.db import IntegrityError
from django.conf import settings
from piezas.models import Tag, TagsIds
import csv
import logging

logger = logging.getLogger(__name__)
logger.setLevel("INFO")


class Command(BaseCommand):
    help = "Import tags from a CSV file. The CSV file must contain a list of ids and tags."

    def handle(self, *args, **kwargs):
        file = settings.TAGS_CSV_PATH
        if not os.path.exists(file):
            logger.error(f"File {file} not found. Stop")
            return
        
        with open(file, newline="") as archivo_csv:
            artifact_tags_relationships = csv.reader(archivo_csv, delimiter=",")
            for artifact_tags_tuple in artifact_tags_relationships:
                tags = artifact_tags_tuple[1].split(", ")
                # Create tag object
                for tag in tags:
                    try:
                        recentlyAdded = Tag.objects.create(name=tag)
                    except IntegrityError:
                        logger.info(f"Tag {tag} already exists. Skipping its creation")
                        recentlyAdded = Tag.objects.get(name=tag)

                    # Store relationship between tag and future artifact to be created
                    try: 
                        TagsIds.objects.create(
                            tag=recentlyAdded.id, artifactid=int(artifact_tags_tuple[0])
                        )
                        logger.info(
                            f"{tag}-{artifact_tags_tuple[0]} tagIds relationship added successfully"
                        )
                    except IntegrityError:
                        logger.warning(
                            f"{tag}-{artifact_tags_tuple[0]} tagIds relationship already exists. Skipping its creation"
                        )
                        continue
