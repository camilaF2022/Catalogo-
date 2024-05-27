from django.core.management.base import BaseCommand, CommandParser
from django.core.files import File
from django.conf import settings
from django.db import IntegrityError
from piezas.models import Model

import os
import shutil

class Command(BaseCommand):
    help = 'add 3d models files to Media Table from media folder'

    def add_arguments(self, parser):
        parser.add_argument('folderFiles', type=str)

    def handle(self, *args, **kwargs):
        
        #Obtener archivos la carpeta
        argument_path = os.listdir( kwargs.get('folderFiles'))

        textures = [f for f in argument_path if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        objects = [f for f in argument_path if f.lower().endswith('.obj')]
        materials = [f for f in argument_path if f.lower().endswith('.mtl')]

        # Crear un diccionario para emparejar archivos
        file_pairs = {}
        
        for texture in textures:
            base_name = os.path.splitext(texture)[0]  # 'texture1' de 'texture1.png'
            base_name_id = base_name.split(".")[0]
            file_pairs[base_name_id] = {'texture': texture}
        
        for obj in objects:
            base_name = os.path.splitext(obj)[0]
            base_name_id = base_name.split(".")[0]
            if base_name_id in file_pairs:
                file_pairs[base_name_id]['object'] = obj
        
        for material in materials:
            base_name = os.path.splitext(material)[0]
            base_name_id = base_name.split(".")[0]
            if base_name_id in file_pairs:
                file_pairs[base_name_id]['material'] = material
        
        
        # Mover archivos y crear registros en la base de datos
        for base_name_id, files in file_pairs.items():
            texture_file = files.get('texture')
            object_file = files.get('object')
            material_file = files.get('material')
            # print(texture_file, object_file, material_file)

            if texture_file and object_file and material_file:
                # # Mover archivos
                texture_path = os.path.join( kwargs.get('folderFiles'),texture_file)
                object_path = os.path.join( kwargs.get('folderFiles'),object_file)
                material_path = os.path.join( kwargs.get('folderFiles'),material_file)

                # Guardar en el modelo
                with open(texture_path, 'rb') as tex_file, open(object_path, 'rb') as obj_file, open(material_path, 'rb') as mat_file:
                    new_model = Model(
                        id=int(base_name_id),
                        texture=File(tex_file, name=os.path.basename(texture_path) ),
                        object=File(obj_file, name=os.path.basename(object_path) ),
                        material=File(mat_file, name=os.path.basename(material_path) )
                    )
                    new_model.save()
                    self.stdout.write(self.style.SUCCESS(f'Successfully imported {texture_file}, {object_file}, {material_file}'))
            else:
                self.stdout.write(self.style.WARNING(f'Skipping {base_name_id} as corresponding object or material file does not exist'))