from django.core.management.base import BaseCommand, CommandParser
from django.db import IntegrityError
from piezas.models import Culture, CultureIds
import csv

class Command(BaseCommand):
    help = 'add new data from csv to Metadata Table'

    def add_arguments(self, parser):
        parser.add_argument('csvfile', type=str)

    def handle(self, *args, **kwargs):
        file = "./" + kwargs.get('csvfile')
        with open(file, newline='') as archivo_csv:
            lector_csv = csv.reader(archivo_csv, delimiter=',')
            for fila in lector_csv:
                try:
                    Culture.objects.create(
                        name=fila[1]
                    )
                except IntegrityError:
                    print("Error: No se puede insertar un objeto con el mismo valor para 'nombre'.")
                
                recentlyAdded = Culture.objects.get(
                    name=fila[1]
                )
                CultureIds.objects.create(
                    culture=recentlyAdded.id,
                    artifactid=int(fila[0])
                )
                print("todo funciona bien")