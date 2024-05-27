from django.core.management.base import BaseCommand
from django.db import IntegrityError
from django.conf import settings
from piezas.models import Shape, ShapeIds
import csv
import os

class Command(BaseCommand):
    help = 'add new data from csv to Metadata Table'

    def add_arguments(self, parser):
        parser.add_argument('file', type=str)

    def handle(self, *args, **kwargs):
        file = "./" + kwargs.get('file')
        try:
            with open(file, 'r') as textshape:

                content = textshape.readlines()

            processed_content = [line.strip() for line in content]
            print(processed_content)
            try:
                Shape.objects.create(
                    name=os.path.splitext(os.path.basename(kwargs.get('file')))[0]
                )
            except IntegrityError:
                    print("Error: No se puede insertar un objeto con el mismo valor para 'nombre'.")
            
            recentlyAdded = Shape.objects.get(
                name=os.path.splitext(os.path.basename(kwargs.get('file')))[0]
            )
            for id in processed_content:
                 ShapeIds.objects.create(
                      shape=recentlyAdded.id,
                      artifactid=int(id)
                 )
                

        except FileNotFoundError:
                print("No se encontro el txt")
                
                    