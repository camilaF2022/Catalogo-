from django.db import models

# Create your models here.
class Shape(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name + ": " + str(self.id)

class Culture(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name + ": " + str(self.id)
    
class Tag(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name + ": " + str(self.id)



class Thumbnail(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    path = models.ImageField(upload_to='thumbnails/', unique=True)

class Model(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    texture = models.ImageField(upload_to='textures/', unique=True)
    object = models.FileField(upload_to='objects/', unique=True)
    material = models.FileField(upload_to='materials/', unique=True)

class Image(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    id_artifact = models.ForeignKey('Artifact', on_delete=models.CASCADE, related_name='artifact')
    path = models.ImageField(upload_to='images/',unique=True)

class Artifact(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    description = models.CharField(max_length=300)
    id_thumbnail = models.ForeignKey(Thumbnail, on_delete=models.CASCADE, related_name='thumbnail')
    id_model = models.ForeignKey(Model, on_delete=models.CASCADE, related_name='model3d', default=0)
    id_shape = models.ForeignKey(Shape, on_delete=models.CASCADE, related_name='shape')
    id_culture = models.ForeignKey(Culture, on_delete=models.CASCADE, related_name='culture')
    id_tags = models.ManyToManyField(Tag) 
    


class TagsIds(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    tag = models.IntegerField(default=0)
    artifactid = models.IntegerField(default=0)

class CultureIds(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    culture = models.IntegerField(default=0)
    artifactid = models.IntegerField(default=0)

class ShapeIds(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    shape = models.IntegerField(default=0)
    artifactid = models.IntegerField(default=0)

"""
class Solicitud(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    arq_piece = models.ForeignKey("Artifact", on_delete=models.CASCADE)
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