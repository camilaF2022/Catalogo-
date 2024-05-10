from rest_framework import viewsets
from .serializer import MetadataSerializer
from .models import Metadata


# Create your views here.
class MetadataView(viewsets.ModelViewSet):
    serializer_class = MetadataSerializer
    queryset = Metadata.objects.all()