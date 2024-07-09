"""
This module configures URL patterns for the Django project.

It includes routes for:
- The Django admin interface.
- Authentication via the `LoginView`.
- The catalog section, which is handled by including URL patterns from the `piezas` application.

Additionally, it configures the serving of media files in development through Django's static serve mechanism.

Imports:
- `admin` for admin site URLs.
- `path` and `include` for URL routing.
- `obtain_auth_token` from Django REST Framework for token authentication (unused in current urlpatterns but available for future use).
- `settings` and `static` for serving media files in development.
- `LoginView` for authentication views.
"""

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
