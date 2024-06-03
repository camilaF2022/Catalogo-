from rest_framework import serializers
from .models import Tag, Shape, Culture, Artifact, Model, Thumbnail, Image


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"


class ShapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shape
        fields = "__all__"


class CultureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Culture
        fields = "__all__"


class ArtifactSerializer(serializers.ModelSerializer):
    attributes = serializers.SerializerMethodField()
    preview = serializers.SerializerMethodField()
    model = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
        model = Artifact
        fields = [
            "id",
            "attributes",
            "preview",
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

    def get_preview(self, instance):
        return self.context["request"].build_absolute_uri(
            instance.id_thumbnail.path.url
        )

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
    preview = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Artifact
        fields = ["id", "attributes", "preview"]

    def get_attributes(self, instance):
        shapeInstance = Shape.objects.get(id=instance.id_shape.id)
        tagsInstances = Tag.objects.filter(id__in=instance.id_tags.all())
        cultureInstance = Culture.objects.get(id=instance.id_culture.id)
        description = instance.description
        tags = []
        for tag in tagsInstances:
            tags.append((tag.id, tag.name))

        attributes = {
            "shape": (shapeInstance.id, shapeInstance.name),
            "tags": tags,
            "culture": (cultureInstance.id, cultureInstance.name),
            "description": description,
        }
        return attributes

    def get_preview(self, instance):
        return self.context["request"].build_absolute_uri(
            instance.id_thumbnail.path.url
        )


# Obtains the json object with the id of a new created artifact
class NewArtifactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artifact
        fields = ["id"]
