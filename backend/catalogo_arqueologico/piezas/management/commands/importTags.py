from django.core.management.base import BaseCommand, CommandParser
from django.db import IntegrityError
from django.conf import settings
from piezas.models import Tag, TagsIds
import csv
import os

class Command(BaseCommand):
    help = 'add new data from csv to Metadata Table'

    def add_arguments(self, parser):
        parser.add_argument('csvfile', type=str)

    def handle(self, *args, **kwargs):
        file = "./" + kwargs.get('csvfile')
        with open(file, newline='') as archivo_csv:
            lector_csv = csv.reader(archivo_csv, delimiter=',')
            for fila in lector_csv:
                tags = fila[1].split(', ')
                for tag in tags:
                    try:
                        Tag.objects.create(
                            name=tag
                        )
                    except IntegrityError:
                        print("Error: No se puede insertar un objeto con el mismo valor para 'nombre'.")
                    
                    
                    print("aqui sigue")
                    recentlyAdded= Tag.objects.get(
                        name=tag
                    )
                    TagsIds.objects.create(
                        tag=recentlyAdded.id,
                        artifactid=int(fila[0])
                    )
                    
