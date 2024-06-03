from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from catalogo_arqueologico.serializer import UserSerializer


class LoginView(APIView):
    def post(self, request):
        user = get_object_or_404(User, email=self.request.data['email'])
        if not user.check_password(self.request.data['password']):
            return Response({"detail": "Contraseña Incorrecta"}, 
                            status=status.HTTP_404_NOT_FOUND)
        token, _ = Token.objects.get_or_create(user=user)
        data = UserSerializer(instance=user).data
        return Response({"token": token.key, "user": data}, 
                        status=status.HTTP_200_OK)
    

