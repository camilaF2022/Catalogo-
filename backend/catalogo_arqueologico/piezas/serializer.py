from rest_framework import serializers
from .models import Tag, Shape, Culture, Artifact

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
        fields = ['type']

class PiezaArqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artifact
        fields = '__all__'