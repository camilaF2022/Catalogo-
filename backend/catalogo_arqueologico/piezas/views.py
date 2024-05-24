from rest_framework import viewsets, generics, permissions, authentication
from .serializers import TagSerializer, ShapeSerializer, CultureSerializer, ArtifactSerializer
from .models import Tag, Shape, Artifact
from .authentication import TokenAuthentication
from .permissions import IsFuncionarioPermission
class ArtifactDetailAPIView(generics.RetrieveAPIView):
    queryset = Artifact.objects.all()
    serializer_class = ArtifactSerializer
    #aca entregar todo, las urls y todo

class ArtifactListCreateAPIView(generics.ListCreateAPIView):
    queryset = Artifact.objects.all()
    serializer_class = ArtifactSerializer
    authentication_classes = [authentication.SessionAuthentication, TokenAuthentication]
    permission_classes = [permissions.IsAdminUser, IsFuncionarioPermission]
    #En el list, se deberia entregar por lo menos el thumbnail

class ArtifactDestroyAPIView(generics.DestroyAPIView):
    queryset = Artifact.objects.all()
    serializer_class = ArtifactSerializer
    lookup_field = 'pk'


#class MediaView(viewsets.ModelViewSet):
#    serializer_class = Model3dSerializer
#    queryset = Media.objects.get(name__icontains=('%s' % ))