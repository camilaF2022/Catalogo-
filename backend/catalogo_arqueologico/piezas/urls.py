from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from piezas import views


#router = routers.DefaultRouter()
#router.register(r'artifact', views.ArtifactView, 'Artifact')

#router_media = routers.DefaultRouter()
#router_media.register(r'tag', views.TagView, 'Tag')

urlpatterns = [
    path('docs/', include_docs_urls(title="Metadata API")),
    path('oneArtifact/<int:pk>/delete', views.ArtifactDestroyAPIView.as_view()),
    path('oneArtifact/<int:pk>/', views.ArtifactDetailAPIView.as_view()),
    path('listArtifacts/', views.ArtifactListAPIView.as_view()),
    path('create/', views.ArtifactCreateAPIView.as_view()),
    path('catalog/', views.CatalogAPIView.as_view()),
]