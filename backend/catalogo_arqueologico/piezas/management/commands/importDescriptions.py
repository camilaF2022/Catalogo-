from django.core.management.base import BaseCommand, CommandParser
from django.db import IntegrityError
from django.core.files import File
from django.conf import settings
from django.db.models import Q
from piezas.models import *
import csv
import os
import re

def addImages(self, artifact,realId):
    multimedia_path = os.path.join(settings.BASE_DIR, 'multimedia')
    if not os.path.exists(multimedia_path):
        self.stdout.write(self.style.ERROR(f'Directory {multimedia_path} does not exist'))
        return
    image_dirs = os.listdir(multimedia_path)
    if realId in image_dirs:
        image_files = os.listdir(os.path.join(multimedia_path, realId))
        for image_name in image_files:
            parts = re.split(r'[._]', image_name)
            if any(('pat' in string or 'thumb' in string or 'flat' in string) for string in parts):
                image_path = os.path.join(multimedia_path, realId,image_name)
                with open(image_path, 'rb') as image:
                    new_image = Image.objects.create(
                        id_artifact = artifact,
                        path = File(image, name=image_name)
                    )
                    new_image.save()


class Command(BaseCommand):
    help = 'add new data from csv to PiezaArq Table'

    def add_arguments(self, parser):
        parser.add_argument('csvfile', type=str) #csv con las descripcion con las piezas

    def handle(self, *args, **kwargs):
        descriptions = "./" + kwargs.get('csvfile')

        #Se leerá los csv de los metadata, y se ira formando un csv con tales cosas
        with open(descriptions, newline='') as archivo_csv:
            lector_csv = csv.reader(archivo_csv, delimiter=',')
            for fila in lector_csv:
                realId = fila[0]
                print(realId)
                descriptionArtifact = fila[1] #tenemos su descripcion
                idThumbnail = Thumbnail.objects.get(path__icontains=realId) #este es el thumnail
                idModel = Model.objects.filter(
                    Q(texture__icontains=realId) & 
                    Q(object__icontains=realId) & 
                    Q(material__icontains=realId)
                ).first()
                idShape = ShapeIds.objects.get(artifactid=int(realId)) 
                idCulture = CultureIds.objects.get(artifactid=int(realId)) 
                idTags =  TagsIds.objects.filter(artifactid=int(realId))
                #Estos tres pueden ser un arreglo

                realShape = Shape.objects.get(id=idShape.shape)
                realCulture = Culture.objects.get(id=idCulture.culture)

                newArtifact = Artifact(
                    id = int(realId),
                    description = descriptionArtifact,
                    id_thumbnail = idThumbnail,
                    id_model = idModel,
                    id_shape = realShape,
                    id_culture = realCulture
                )             
                newArtifact.save()
                print("se guardo un artefacto")
                if idTags is not None:
                    for tags in idTags:
                        newArtifact.id_tags.add(tags.tag)
                addImages(self, newArtifact,realId)

                
                