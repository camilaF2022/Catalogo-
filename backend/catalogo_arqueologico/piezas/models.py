from django.db import models
from django.core.files.storage import FileSystemStorage

from django.conf import settings


class CustomStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        if self.exists(name):
            self.delete(name)
        return name


# Create your models here.
class Shape(models.Model):
    """
    Shape model to store the shapes of the artifacts
    Name must be unique
    """
    
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)


class Culture(models.Model):
    """
    Culture model to store the cultures of the artifacts
    Name must be unique
    """

    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)


class Tag(models.Model):
    """
    Tag model to store the tags of the artifacts
    Name must be unique
    """

    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)


class Thumbnail(models.Model):
    """
    Thumbnail model to store the thumbnails of the artifacts
    Images must be unique
    """

    id = models.BigAutoField(primary_key=True)
    path = models.ImageField(upload_to=settings.THUMBNAILS_ROOT, unique=True)


class Model(models.Model):
    """
    Model to store the 3D models of the artifacts
    Each attribute must be unique
    """

    id = models.BigAutoField(primary_key=True)
    texture = models.ImageField(upload_to=settings.MATERIALS_ROOT, unique=True)
    object = models.FileField(upload_to=settings.OBJECTS_ROOT, unique=True)
    material = models.FileField(upload_to=settings.MATERIALS_ROOT, unique=True)


class Image(models.Model):
    """
    Image model to store the images of the artifacts
    Images must be unique
    """

    id = models.BigAutoField(primary_key=True)
    id_artifact = models.ForeignKey(
        "Artifact", on_delete=models.CASCADE, null=True, related_name="artifact"
    )
    path = models.ImageField(upload_to=settings.IMAGES_ROOT, unique=True)


class Artifact(models.Model):
    """
    Artifact model to store the artifacts
    """

    id = models.BigAutoField(primary_key=True)
    description = models.CharField(max_length=300)
    id_thumbnail = models.ForeignKey(
        Thumbnail, on_delete=models.SET_NULL, null=True, related_name="thumbnail"
    )
    id_model = models.ForeignKey(
        Model, on_delete=models.CASCADE, related_name="model", default=0
    )
    id_shape = models.ForeignKey(
        Shape, on_delete=models.SET_NULL, null=True, related_name="shape"
    )
    id_culture = models.ForeignKey(
        Culture, on_delete=models.SET_NULL, null=True, related_name="culture"
    )
    id_tags = models.ManyToManyField(Tag)


class TagsIds(models.Model):
    """
    Auxiliary table to store the relationship between the tag and the artifact
    Tag and ArtifactId must be unique together
    """

    id = models.BigAutoField(primary_key=True)
    tag = models.IntegerField(default=0)
    artifactid = models.IntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["tag", "artifactid"], name="unique_tag_artifact"
            )
        ]


class CultureIds(models.Model):
    """
    Auxiliary table to store the relationship between the culture and the artifact
    Culture and ArtifactId must be unique together
    """

    id = models.BigAutoField(primary_key=True)
    culture = models.IntegerField(default=0)
    artifactid = models.IntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["culture", "artifactid"], name="unique_culture_artifact"
            )
        ]


class ShapeIds(models.Model):
    """
    Auxiliary table to store the relationship between the shape and the artifact
    Shape and ArtifactId must be unique together
    """

    id = models.BigAutoField(primary_key=True)
    shape = models.IntegerField(default=0)
    artifactid = models.IntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["shape", "artifactid"], name="unique_shape_artifact"
            )
        ]



class Institution(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)

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
