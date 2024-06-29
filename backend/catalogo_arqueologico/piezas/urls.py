from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from piezas import views

urlpatterns = [
    path('docs/', include_docs_urls(title="Metadata API")),
    path('artifacts/', views.CatalogAPIView.as_view()),
    path('artifact/<int:pk>/', views.ArtifactDetailAPIView.as_view()),
    path('artifact/<int:pk>/update', views.ArtifactUpdateAPIView.as_view()),
    path('artifact/<int:pk>/delete', views.ArtifactDestroyAPIView.as_view()),
    path('artifact/upload', views.ArtifactCreateAPIView.as_view()),
    path('metadata/', views.MetadataListAPIView.as_view()),
    path('allinstitutions/', views.InstitutionAPIView.as_view()),
    path('institution/<int:pk>', views.InstitutionDetailAPIView.as_view()),
    path('artifact/<int:pk>/download', views.ArtifactDownloadAPIView.as_view()),
]
