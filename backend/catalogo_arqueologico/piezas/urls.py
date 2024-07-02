from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from piezas import views

urlpatterns = [
    path('docs/', include_docs_urls(title="Metadata API")),
    path('artifacts/', views.CatalogAPIView.as_view()),
    path('artifact/upload', views.ArtifactCreateUpdateAPIView.as_view()),
    path('artifact/<int:pk>/', views.ArtifactDetailAPIView.as_view()),
    path('artifact/<int:pk>/update', views.ArtifactCreateUpdateAPIView.as_view()),
    path('metadata/', views.MetadataListAPIView.as_view()),
    path('institutions/', views.InstitutionAPIView.as_view()),
    path('artifact/<int:pk>/download', views.ArtifactDownloadAPIView.as_view()),
]

