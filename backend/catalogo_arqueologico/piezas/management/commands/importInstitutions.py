from django.core.management.base import BaseCommand
from django.db import IntegrityError
from django.conf import settings
from piezas.models import Institution

import os
import logging
import csv

logger = logging.getLogger(__name__)
logger.setLevel("INFO")

class Command(BaseCommand):
    help = "This command reads csv with institutions. It is necessary to specify which column is the one with the name"

    def handle(self, *args, **kwargs):
        file = settings.INSTITUTIONS_CSV_PATH
        if not os.path.exists(file):
            logger.error(f"File {file} not found. Stop")
            return

        with open(file, "r", encoding="utf-8") as archivo_csv:
            institutions = csv.reader(archivo_csv, delimiter=",")
            for institution in institutions:
                try:
                    recentlyAdded = Institution.objects.create(
                        name=institution[3]
                    )
                except IntegrityError:
                    logger.info(
                        f"Institution {institution[3]} already exists. Skipping its creation"
                    )


