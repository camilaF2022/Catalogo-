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
        media_path = os.path.join(settings.MEDIA_ROOT)
    
        textures_path = os.path.join(media_path, 'textures')
        objects_path = os.path.join(media_path, 'objects')
        materials_path = os.path.join(media_path, 'materials')

        # Crear directorios si no existen
        os.makedirs(textures_path, exist_ok=True)
        os.makedirs(objects_path, exist_ok=True)
        os.makedirs(materials_path, exist_ok=True)

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

                new_texture_path = os.path.join(textures_path, texture_file)
                new_object_path = os.path.join(objects_path, object_file)
                new_material_path = os.path.join(materials_path, material_file)

                shutil.move(texture_path, new_texture_path)
                shutil.move(object_path, new_object_path)
                shutil.move(material_path, new_material_path)

                # Guardar en el modelo
                with open(new_texture_path, 'rb') as tex_file, open(new_object_path, 'rb') as obj_file, open(new_material_path, 'rb') as mat_file:
                    new_model = Model(
                        id=int(base_name_id),
                        texture=File(tex_file, name=texture_file),
                        object=File(obj_file, name=object_file),
                        material=File(mat_file, name=material_file)
                    )
                    new_model.save()
                    self.stdout.write(self.style.SUCCESS(f'Successfully imported {texture_file}, {object_file}, {material_file}'))
            else:
                self.stdout.write(self.style.WARNING(f'Skipping {base_name_id} as corresponding object or material file does not exist'))