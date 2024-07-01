import os
from django.conf import settings
from django.core.files import File
from rest_framework import serializers
from .models import Tag, Shape, Culture, Artifact, Model, Thumbnail, Image, Institution,Requester
import logging

logger = logging.getLogger(__name__)

class RequesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requester
        fields = "__all__"

class ShapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shape
        fields = "__all__"


class CultureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Culture
        fields = "__all__"


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"


class ThumbnailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thumbnail
        fields = "__all__"


class ArtifactSerializer(serializers.ModelSerializer):
    attributes = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    model = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
        model = Artifact
        fields = [
            "id",
            "attributes",
            "thumbnail",
            "model",
            "images",
        ]

    def get_attributes(self, instance):
        Tags = [{"id": tag.id, "value": tag.name} for tag in instance.id_tags.all()]
        wholeDict = {
            "shape": {"id": instance.id_shape.id, "value": instance.id_shape.name},
            "tags": Tags,
            "culture": {
                "id": instance.id_culture.id,
                "value": instance.id_culture.name,
            },
            "description": instance.description,
        }
        return wholeDict

    def get_thumbnail(self, instance):
        if instance.id_thumbnail:
            return self.context["request"].build_absolute_uri(
                instance.id_thumbnail.path.url
            )
        else:
            return None

    def get_model(self, instance):
        realModel = instance.id_model
        modelDict = {
            "object": self.context["request"].build_absolute_uri(realModel.object.url),
            "material": self.context["request"].build_absolute_uri(
                realModel.material.url
            ),
            "texture": self.context["request"].build_absolute_uri(
                realModel.texture.url
            ),
        }
        return modelDict

    def get_images(self, instance):
        everyImage = Image.objects.filter(id_artifact=instance.id)
        Images = []
        for image in everyImage:
            Images.append(self.context["request"].build_absolute_uri(image.path.url))
        return Images


# Obtains the json object with the attributes of the artifacts for the catalog
class CatalogSerializer(serializers.ModelSerializer):
    attributes = serializers.SerializerMethodField(read_only=True)
    thumbnail = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Artifact
        fields = ["id", "attributes", "thumbnail"]

    def get_attributes(self, instance):
        shapeInstance = Shape.objects.get(id=instance.id_shape.id)
        tagsInstances = Tag.objects.filter(id__in=instance.id_tags.all())
        cultureInstance = Culture.objects.get(id=instance.id_culture.id)
        description = instance.description
        tags = []
        for tag in tagsInstances:
            tags.append({"id": tag.id, "value": tag.name})

        attributes = {
            "shape": {"id": shapeInstance.id, "value": shapeInstance.name},
            "tags": tags,
            "culture": {"id": cultureInstance.id, "value": cultureInstance.name},
            "description": description,
        }
        return attributes

    def get_thumbnail(self, instance):
        if instance.id_thumbnail:
            return self.context["request"].build_absolute_uri(
                instance.id_thumbnail.path.url
            )
        else:
            return None


class NewArtifactSerializer(serializers.ModelSerializer):
    model = serializers.DictField(child=serializers.FileField(), write_only=True)
    thumbnail = serializers.ImageField(write_only=True, required=False, allow_null=True)
    description = serializers.CharField()
    id_shape = serializers.PrimaryKeyRelatedField(queryset=Shape.objects.all())
    id_culture = serializers.PrimaryKeyRelatedField(queryset=Culture.objects.all())
    id_tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, required=False
    )

    class Meta:
        model = Artifact
        fields = [
            "id",
            "description",
            "id_shape",
            "id_culture",
            "id_tags",
            "model",
            "thumbnail",
        ]

    def create(self, validated_data):
        """
        Create a new artifact with the data and files.
        Files require a name attribute to be found or stored.
        """

        def get_or_create_path(root, file, filename):
            """
            Auxiliary function to create a File model if it does not exist.
            It uses the os.path since files are not stored like models do.
            """
            if os.path.exists(os.path.join(settings.MEDIA_ROOT, root, filename)):
                # If the file already exists, skip the creation of the model
                logger.info(f"File {filename} already exists")
                return os.path.join(root, filename)
            else:
                # Create File model
                return File(file, name=filename)

        def update_or_create_and_update(model, data):
            """
            Auxiliary function to update or create a model and return the object.
            """
            obj, created = model.objects.get_or_create(**data)
            logger.info(f"Object {obj} created: {created}")
            return obj

        tags_data = validated_data.pop("id_tags", [])
        thumbnail_data = validated_data.pop("thumbnail", None)
        images_data = self.context["request"].FILES.getlist("images")

        texture = self.context["request"].FILES.get("model[texture]")
        object_file = self.context["request"].FILES.get("model[object]")
        material = self.context["request"].FILES.get("model[material]")
        if not (texture and object_file and material):
            raise serializers.ValidationError("Model files are required")

        texture_filename = texture.name
        object_filename = object_file.name
        material_filename = material.name

        texture_file_path = get_or_create_path(
            settings.MATERIALS_ROOT, texture, texture_filename
        )
        object_file_path = get_or_create_path(
            settings.OBJECTS_ROOT, object_file, object_filename
        )
        material_file_path = get_or_create_path(
            settings.MATERIALS_ROOT, material, material_filename
        )

        model_instance = update_or_create_and_update(
            Model,
            {
                "texture": texture_file_path,
                "object": object_file_path,
                "material": material_file_path,
            },
        )

        thumbnail_instance = None
        if thumbnail_data:
            thumbnail_filename = thumbnail_data.name
            thumbnail_file_path = get_or_create_path(
                settings.THUMBNAILS_ROOT, thumbnail_data, thumbnail_filename
            )
            thumbnail_instance = update_or_create_and_update(
                Thumbnail, {"path": thumbnail_file_path}
            )

        newArtifact = Artifact.objects.create(
            description=validated_data["description"],
            id_thumbnail=thumbnail_instance,
            id_model=model_instance,
            id_shape=validated_data["id_shape"],
            id_culture=validated_data["id_culture"],
        )

        newArtifact.id_tags.set(tags_data)

        if images_data:
            # Update or create images
            for image in images_data:
                new_image_filename = image.name
                new_image_file_path = get_or_create_path(
                    settings.IMAGES_ROOT, image, new_image_filename
                )
                update_or_create_and_update(
                    Image, {"path": new_image_file_path, "id_artifact": newArtifact}
                )
        return newArtifact

    def to_representation(self, instance):
        """
        Return only the ID of the Artifact instance.
        """
        return {"id": instance.id}


class UpdateArtifactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artifact
        fields = ["id"]

    def update(self, instance, validated_data):
        """
        Update the artifact with the new data and files.
        All attributes are required to be updated. This is to be able to set null some attributes.
        Files require a name attribute to be found or stored.
        """

        def get_or_create_path(root, file, filename):
            """
            Auxiliary function to create a File model if it does not exist.
            It uses the os.path since files are not stored like models do.
            """
            if os.path.exists(os.path.join(settings.MEDIA_ROOT, root, filename)):
                # If the file already exists, skip the creation of the model
                logger.info(f"File {filename} already exists")
                return os.path.join(root, filename)
            else:
                # Create File model
                return File(file, name=filename)

        def update_or_create_and_update(model, data):
            """
            Auxiliary function to update or create a model and return the object.
            """
            obj, created = model.objects.get_or_create(**data)
            logger.info(f"Object {obj} created: {created}")
            return obj

        files = self.context["request"].FILES

        texture = files.get("model[texture]")
        object = files.get("model[object]")
        material = files.get("model[material]")
        if not (texture and object and material):
            raise ValueError("Model files are required")

        texture_filename = texture.name
        object_filename = object.name
        material_filename = material.name

        texture_file_path = get_or_create_path(
            settings.MATERIALS_ROOT, texture, texture_filename
        )
        object_file_path = get_or_create_path(
            settings.OBJECTS_ROOT, object, object_filename
        )
        material_file_path = get_or_create_path(
            settings.MATERIALS_ROOT, material, material_filename
        )

        model_obj = update_or_create_and_update(
            Model,
            {
                "texture": texture_file_path,
                "object": object_file_path,
                "material": material_file_path,
            },
        )
        instance.id_model = model_obj

        thumbnail = files.get("thumbnail")
        if not thumbnail:
            instance.id_thumbnail = None
        else:
            thumbnail_filename = thumbnail.name
            thumbnail_file_path = get_or_create_path(
                settings.THUMBNAILS_ROOT, thumbnail, thumbnail_filename
            )
            thumbnail_obj = update_or_create_and_update(
                Thumbnail, {"path": thumbnail_file_path}
            )
            instance.id_thumbnail = thumbnail_obj

        new_images = files.getlist("images")
        if new_images:
            # There are old and new images
            # Set null old relationships
            old_images = Image.objects.filter(id_artifact=instance.id)
            for old_image in old_images:
                old_image.id_artifact = None
                old_image.save()
            # Update or create new images
            for image in new_images:
                new_image_filename = image.name
                new_image_file_path = get_or_create_path(
                    settings.IMAGES_ROOT, image, new_image_filename
                )
                update_or_create_and_update(
                    Image, {"path": new_image_file_path, "id_artifact": instance}
                )
        else:
            # It's an empty list
            # Set null old relationships
            old_images = Image.objects.filter(id_artifact=instance.id)
            for old_image in old_images:
                old_image.id_artifact = None
                old_image.save()

        if "description" in validated_data:
            instance.description = validated_data["description"]

        if "id_shape" in validated_data:
            instance.id_shape = validated_data["id_shape"]

        if "id_culture" in validated_data:
            instance.id_culture = validated_data["id_culture"]

        if "id_tags" in validated_data:
            instance.id_tags.set(validated_data["id_tags"])
        else:
            # It's an empty list
            instance.id_tags.clear()

        instance.save()
        return {"id": instance.id}


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = [
            "id",
            "name"
        ]