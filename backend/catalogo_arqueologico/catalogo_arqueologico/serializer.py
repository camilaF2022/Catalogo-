from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()
    
    def get_nombre_completo(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    

    class Meta:
        model = User
        fields = ["id", "username", "email", "nombre_completo"]

