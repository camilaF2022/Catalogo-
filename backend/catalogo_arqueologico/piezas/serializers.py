from rest_framework import serializers
from .models import Tag, Shape, Culture, Artifact, Model, Thumbnail, Image



class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class ShapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shape
        fields = '__all__'

class CultureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Culture
        fields = '__all__'

class ArtifactSerializer(serializers.ModelSerializer):
    attributes = serializers.SerializerMethodField(read_only=True)
    preview = serializers.SerializerMethodField(read_only=True)
    model = serializers.SerializerMethodField(read_only=True)
    images = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Artifact
        fields = [
            'id',
            'attributes',
            'preview',
            'model',
            'images',
        ]

    def get_attributes(self, instance):
        Tags = [(tag.id, tag.name) for tag in instance.id_tags.all()]
        wholeDict = {
            "shape": (instance.id_shape.id, instance.id_shape.name),
            "tags": Tags,
            "culture": (instance.id_culture.id, instance.id_culture.name),
            "description": instance.description
        }
        return wholeDict

    def get_preview(self, instance):
        return self.context["request"].build_absolute_uri(instance.id_thumbnail.path.url)
    
    def get_model(self, instance):
        realModel = instance.id_model
        modelDict = {
            'object': self.context["request"].build_absolute_uri(realModel.object.url),
            'material': self.context["request"].build_absolute_uri(realModel.material.url),
            'texture': self.context["request"].build_absolute_uri(realModel.texture.url)
        }
        return modelDict

    def get_images(self, instance):
        everyImage = Image.objects.filter(id_artifact=instance.id)
        Images = []
        for image in everyImage:
            Images.append(self.context["request"].build_absolute_uri(image.path.url))
        return Images

#class ArtifactSerializer(serializers.ModelSerializer):
#    attributes = serializers.SerializerMethodField(read_only = True)
#    preview = serializers.SerializerMethodField(read_only = True)
#    model = serializers.SerializerMethodField(read_only = True)
#    images = serializers.SerializerMethodField(read_only = True)
#    print("algo")
#    class Meta:
#        model = Artifact
#        fields = ['id',
#                'attributes',
#                'preview',
#                'model',
#                'images',
#                ]
#    
#    def get_attributes(self, instance):
#        realShape = Shape.objects.get(id=instance.id_shape)
#        realCulture  = Culture.objects.get(id=instance.id_culture)
#        everyTag = instance.id_tags.all()
#        Tags = []
#        for tag in everyTag:
#            Tags.append((tag.id, tag.name))
#        
#        wholeDict = {"shape": (realShape.id, realShape.name), "tags": Tags, "culture": (realCulture.id, realCulture.name), "description": instance.description}            
#
#        return wholeDict
#
#    def get_preview(self, instance):
#        realThumbnail = Thumbnail.objects.get(id=instance.id_thumbnail)
#        return realThumbnail.path
#    
#    def get_model(self, instance):
#        realModel = Model.objects.get(id=instance.id_model)
#        modelDict = {'object': realModel.object, 'material': realModel.material, 'texture': realModel.texture}
#        return modelDict
#    
#    def get_images(self, instance):
#        someImages = Image.objects.filter(id_artifact=instance.id)
#        Images = []
#        if someImages:
#             for image in someImages:
#                Images.append(image.path)
#        return Images
#


# Obtains the json object with the attributes of the artifacts for the catalog
class CatalogSerializer(serializers.ModelSerializer):
    attributes = serializers.SerializerMethodField(read_only = True)
    preview = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Artifact
        fields = [
            'id',
            'attributes',
            'preview'
            ]
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
            "description": description
        }
        return attributes

    def get_preview(self, instance):
        return self.context["request"].build_absolute_uri(instance.id_thumbnail.path.url)
# Obtains the json object with the id of a new created artifact
class NewArtifactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artifact
        fields = ['id']
    