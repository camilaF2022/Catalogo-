from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.auth.models import Group
from .validators import validateRut
import logging

logger = logging.getLogger(__name__)


class CustomUser(AbstractUser):
    class RoleUser(models.TextChoices):
        FUNCIONARIO = "FN", "FUNCIONARIO"
        ADMINISTRADOR = "AD", "ADMIN"

    role = models.CharField(
        max_length=2, choices=RoleUser.choices, default=RoleUser.FUNCIONARIO
    )
    institution = models.CharField(max_length=100, blank=True)
    rut = models.CharField(
        max_length=9,
        blank=True,
        help_text="Enter unique identifier without dots or dashes",
        validators=[validateRut],
    )

    def update_group(self):
        self.groups.clear()
        logger.info(f"Updating group for user {self.username} with role {self.role}")
        new_group = None
        if self.role == self.RoleUser.ADMINISTRADOR:
            new_group, _ = Group.objects.get_or_create(name="Administrador")
            self.role = self.RoleUser.ADMINISTRADOR
        elif self.role == self.RoleUser.FUNCIONARIO:
            new_group, _ = Group.objects.get_or_create(name="Funcionario")

        if new_group:
            self.groups.add(new_group)
            logger.info(f"Added user to group: {new_group}")
        logger.info(f"User groups after update: {list(self.groups.all())}")

    def save(self, *args, **kwargs):
        # New user
        if not self.pk:
            self.is_staff = (
                True  # All users are staff so they can access the admin site
            )
            if self.is_superuser:
                self.role = (
                    self.RoleUser.ADMINISTRADOR
                )  # Change default role for superusers
        super().save(*args, **kwargs)
        self.update_group()


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
    texture = models.ImageField(upload_to=settings.MATERIALS_ROOT)
    object = models.FileField(upload_to=settings.OBJECTS_ROOT)
    material = models.FileField(upload_to=settings.MATERIALS_ROOT)


class Image(models.Model):
    """
    Image model to store the images of the artifacts
    Images must be unique
    """

    id = models.BigAutoField(primary_key=True)
    id_artifact = models.ForeignKey(
        "Artifact", on_delete=models.CASCADE, null=True, related_name="images"
    )
    path = models.ImageField(upload_to=settings.IMAGES_ROOT, unique=True)


class Artifact(models.Model):
    """
    Artifact model to store the artifacts
    """

    id = models.BigAutoField(primary_key=True)
    description = models.CharField(max_length=300)
    id_thumbnail = models.ForeignKey(
        Thumbnail, on_delete=models.SET_NULL, null=True, related_name="artifact"
    )
    id_model = models.ForeignKey(
        Model,
        on_delete=models.CASCADE,
        null=True,
        related_name="artifact",
    )
    id_shape = models.ForeignKey(
        Shape, on_delete=models.SET_NULL, null=True, related_name="artifact"
    )
    id_culture = models.ForeignKey(
        Culture, on_delete=models.SET_NULL, null=True, related_name="artifact"
    )
    id_tags = models.ManyToManyField(Tag, blank=True, related_name="artifact")


class TagsIds(models.Model):
    """
    Auxiliary table to store the relationship between the tag and the artifact
    Tag and ArtifactId must be unique together
    """

    id = models.BigAutoField(primary_key=True)
    tag = models.IntegerField()
    artifactid = models.IntegerField()

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
    culture = models.IntegerField()
    artifactid = models.IntegerField()

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
    shape = models.IntegerField()
    artifactid = models.IntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["shape", "artifactid"], name="unique_shape_artifact"
            )
        ]


class Institution(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)


class ArtifactRequester(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50)
    rut = models.CharField(max_length=50)
    email = models.EmailField()
    comments = models.TextField(max_length=500, null=True)
    is_registered = models.BooleanField(default=True)
    institution = models.ForeignKey(
        Institution,
        on_delete=models.SET_NULL,
        null=True,
        related_name="artifact_requester",
    )
    artifact = models.ForeignKey(
        Artifact,
        on_delete=models.SET_NULL,
        null=True,
        related_name="artifact_requester",
    )
