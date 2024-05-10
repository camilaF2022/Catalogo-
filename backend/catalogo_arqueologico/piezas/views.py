from rest_framework import viewsets
from .serializer import MetadataSerializer, MediaSerializer
from .models import Metadata, Media


# Create your views here.
class MetadataView(viewsets.ModelViewSet):
    serializer_class = MetadataSerializer
    queryset = Metadata.objects.all()

class MediaView(viewsets.ModelViewSet):
    serializer_class = MediaSerializer
    queryset = Media.objects.all()