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
            tags.append({"id": tag.id, "value": tag.name})

        attributes = {
            "shape": {"id": shapeInstance.id, "value": shapeInstance.name},
            "tags": tags,
            "culture": {"id": cultureInstance.id, "value": cultureInstance.name},
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

class UpdateArtifactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artifact
        fields = ["id"
        ]
    

    def to_internal_value(self, data):
        new_data = data.get('newData')
        if not new_data:
            raise serializers.ValidationError({
                'newData': 'This field is required.'
            })
        
        # Map newData fields to the corresponding model fields
        internal_value = {
            'new_description': new_data.get('new_description'),
            'new_shape': new_data.get('new_shape')
        }
        return internal_value
    

    def updateOrCreateAndUpdate(self, model, data, key):
        if not data:
            return None
        #Checks if exists, if it does, 
        obj, _ = model.objects.get_or_create(**{key: data})
        return obj
    
    def update(self, instance, validated_data):

        #Change names according to the json from frontend

        if 'new_thumbnail' in validated_data:
            print("Hay nuevo thumbnail")
            instance.id_thumbnail = self.updateOrCreateAndUpdate(Thumbnail, validated_data['new_thumbnail'], "id")
        
        if 'new_model' in validated_data:
            print("Hay nuevo model")
            instance.id_model = self.updateOrCreateAndUpdate(Model, validated_data['new_model'], "id")
        
        if 'new_shape' in validated_data:
            print("Hay nuevo shape")
            instance.id_shape = self.updateOrCreateAndUpdate(Shape, validated_data['new_shape'], "id")
        
        if 'new_culture' in validated_data:
            print("Hay nuevo culture")
            instance.id_culture = self.updateOrCreateAndUpdate(Culture, validated_data['new_culture'], "id")
        
        if 'new_tags' in validated_data:
            print("Hay nuevo tags")
            instance.id_tags.set(validated_data["new_tags"])

        if "new_description" in validated_data:
            print("Hay nuevo description")
            instance.description = validated_data.get('new_description', instance.description)

        instance.save()
        return instance

    #Se necesita obtener los datos nuevos del json de front y cambiarlos aqui
    #Para cosas que se suban, hay que buscarlo en la tabla, si no existe, subirlo y poner en el artefacto
