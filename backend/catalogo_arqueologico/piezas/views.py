from rest_framework import viewsets, generics, permissions, authentication
from .serializers import TagSerializer, ShapeSerializer, CultureSerializer, ArtifactSerializer, NewArtifactSerializer
from .models import Tag, Shape, Artifact
from .authentication import TokenAuthentication
from .permissions import IsFuncionarioPermission
from .serializers import CatalogSerializer

class ArtifactDetailAPIView(generics.RetrieveAPIView):
    queryset = Artifact.objects.all()
    serializer_class = ArtifactSerializer
    #aca entregar todo, las urls y todo

class ArtifactListAPIView(generics.ListAPIView):
    serializer_class = ArtifactSerializer

    def get_queryset(self):
        return Artifact.objects.all()

    def get_serializer_context(self):
        return {'request': self.request}

#class ArtifactListAPIView(generics.ListAPIView):
#    queryset = Artifact.objects.all()
#    serializer_class = ArtifactSerializer
    #authentication_classes = [authentication.SessionAuthentication, TokenAuthentication]
    #permission_classes = [permissions.IsAdminUser, IsFuncionarioPermission]
    #En el list, se deberia entregar por lo menos el thumbnail

class ArtifactCreateAPIView(generics.CreateAPIView):
    queryset = Artifact.objects.all()
    serializer_class = NewArtifactSerializer

class ArtifactDestroyAPIView(generics.DestroyAPIView):
    queryset = Artifact.objects.all()
    serializer_class = ArtifactSerializer
    lookup_field = 'pk'

class CatalogAPIView(generics.ListAPIView):
    queryset = Artifact.objects.all()
    serializer_class = CatalogSerializer
 

#class MediaView(viewsets.ModelViewSet):
#    serializer_class = Model3dSerializer
#    queryset = Media.objects.get(name__icontains=('%s' % ))