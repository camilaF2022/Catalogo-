from django.db import models

# Create your models here.
class Metadata(models.Model):
    LABEL = 1
    CULTURE = 2
    FORM = 3

    TIPO_METADATA = [
        (LABEL, "Tag"),
        (CULTURE, "Culture"),
        (FORM, "Form"),
    ]

    id = models.BigAutoField(primary_key=True, unique=True)
    type = models.IntegerField(choices=TIPO_METADATA)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name + ", " + str(self.type)


class Media(models.Model):
    MODEL = 1
    PHOTO = 2

    TIPO_MEDIA = [
        (MODEL, "Model"),
        (PHOTO, "Photo"),
    ]

    id = models.BigAutoField(primary_key=True, unique=True)
    path = models.CharField(max_length=100)
    type = models.IntegerField(choices=TIPO_MEDIA)
    


class PiezaArq(models.Model):
    
    id = models.BigAutoField(primary_key=True, unique=True)
    description = models.CharField(max_length=300)
    preview = models.CharField(max_length=100)
    model = models.ForeignKey("Metadata", on_delete=models.CASCADE, related_name='models_3d')
    photos = models.ForeignKey("Media", on_delete=models.CASCADE)
    culture = models.ForeignKey("Metadata", on_delete=models.CASCADE, related_name='cultures')
    form = models.ForeignKey("Metadata", on_delete=models.CASCADE, related_name='forms') 
    tags = models.ForeignKey("Metadata", on_delete=models.CASCADE, related_name='labels')




"""
class Solicitud(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    arq_piece = models.ForeignKey("PiezaArq", on_delete=models.CASCADE)
    date = models.DateField()
    approved = models.BooleanField()
    name = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    institution = models.CharField(max_length=50)

    
Para los usuarios, hay que crear 2 o 3 grupos, dependiendo de si existira un usuario general.

Grupo Admin = puede hacer de todo con:
- Tabla Pieza Arqueologica
- Tabla Usuarios
- Tabla Metadata
- Tabla Media
- Tabla Solicitud

Grupo Investigador = puede hacer de todo con:
- Tabla Pieza Arqueologica
- Tabla Metadata
- Tabla Media
'
"""