import os
from django.core.management.base import BaseCommand
from django.db import IntegrityError
from django.conf import settings
from piezas.models import Culture, CultureIds
import csv
import logging

logger = logging.getLogger(__name__)
logger.setLevel("INFO")


class Command(BaseCommand):
    help = "Import cultures from a CSV file. The CSV file must contain a list of ids and cultures."

    def handle(self, *args, **kwargs):
        file = settings.CULTURE_CSV_PATH
        if not os.path.exists(file):
            logger.error(f"File {file} not found. Stop")
            return
        
        with open(file, newline="") as archivo_csv:
            artifact_culture_relationships = csv.reader(archivo_csv, delimiter=",")
            for artifact_culture_tuple in artifact_culture_relationships:
                # Create culture object
                try:
                    recentlyAdded = Culture.objects.create(
                        name=artifact_culture_tuple[1]
                    )
                except IntegrityError:
                    logger.info(
                        f"Culture {artifact_culture_tuple[1]} already exists. Skipping its creation"
                    )
                    recentlyAdded = Culture.objects.get(
                        name=artifact_culture_tuple[1]
                    )
                # Store relationship between culture and future artifact to be created
                try:
                    CultureIds.objects.create(
                        culture=recentlyAdded.id,
                        artifactid=int(artifact_culture_tuple[0]),
                    )
                    logger.info(
                        f"{artifact_culture_tuple[1]}-{artifact_culture_tuple[0]} cultureIds relationship added successfully"
                    )
                except IntegrityError:
                    logger.warning(
                        f"{artifact_culture_tuple[1]}-{artifact_culture_tuple[0]} cultureIds relationship already exists. Skipping its creation"
                    )
                    continue
