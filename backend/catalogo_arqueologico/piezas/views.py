from rest_framework import viewsets
from .serializer import TagSerializer, ShapeSerializer, CultureSerializer
from .models import Tag, Shape


# Create your views here.
class MetadataView(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()

class MediaView(viewsets.ModelViewSet):
    serializer_class = ShapeSerializer
    queryset = Shape.objects.all()


#class MediaView(viewsets.ModelViewSet):
#    serializer_class = Model3dSerializer
#    queryset = Media.objects.get(name__icontains=('%s' % ))