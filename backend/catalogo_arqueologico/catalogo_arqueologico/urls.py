from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from django.conf import settings
from django.conf.urls.static import static
from catalogo_arqueologico.views import LoginView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", LoginView.as_view()),
    path("catalog/", include("piezas.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
