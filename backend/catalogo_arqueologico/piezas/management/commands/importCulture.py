from django.core.management.base import BaseCommand, CommandParser
from django.db import IntegrityError
from piezas.models import Metadata
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
                    Metadata.objects.create(
                        type=2,
                        name=fila[1]
                    )
                except IntegrityError:
                    print("Error: No se puede insertar un objeto con el mismo valor para 'nombre'.")
                
                