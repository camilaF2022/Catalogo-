import os
from django.conf import settings
from django.core.files import File
from rest_framework import serializers
from .models import Tag, Shape, Culture, Artifact, Model, Thumbnail, Image, Institution
import logging

logger = logging.getLogger(__name__)


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


class UpdateArtifactSerializer(serializers.ModelSerializer):
    description = serializers.CharField()
    id_shape = serializers.PrimaryKeyRelatedField(queryset=Shape.objects.all())
    id_culture = serializers.PrimaryKeyRelatedField(queryset=Culture.objects.all())

    class Meta:
        model = Artifact
        fields = ["id", "description", "id_shape", "id_culture", "id_tags"]
        extra_kwargs = {"id_tags": {"required": False}}

    def create(self, validated_data):
        tags = validated_data.pop("id_tags", [])
        instance = Artifact.objects.create(**validated_data)
        instance.id_tags.set(tags)
        return instance

    def update(self, instance, validated_data):
        instance.description = validated_data.get("description", instance.description)
        instance.id_shape = validated_data.get("id_shape", instance.id_shape)
        instance.id_culture = validated_data.get("id_culture", instance.id_culture)
        instance.id_tags.set(validated_data.get("id_tags", []))

        instance.save()
        return instance


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ["id", "name"]
