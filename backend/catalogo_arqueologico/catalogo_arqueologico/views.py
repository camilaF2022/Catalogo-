from piezas.models import CustomUser
from .serializer import UserSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token


class LoginView(APIView):
    def post(self, request):
        if "email" not in self.request.data or "password" not in self.request.data:
            return Response(
                {"detail": "Ingrese correo y contraseña"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = CustomUser.objects.get(email=request.data["email"])
        except CustomUser.DoesNotExist:
            return Response(
                {"detail": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )

        if not user.check_password(self.request.data["password"]):
            return Response(
                {"detail": "Contraseña incorrecta"}, status=status.HTTP_404_NOT_FOUND
            )
        token, _ = Token.objects.get_or_create(user=user)
        data = UserSerializer(instance=user).data
        return Response({"token": token.key, "user": data}, status=status.HTTP_200_OK)
