from rest_framework import authentication, generics, permissions
from rest_framework.pagination import PageNumberPagination
from .serializers import (
    ArtifactSerializer,
    NewArtifactSerializer,
    CatalogSerializer,
    UpdateArtifactSerializer,
    InstitutionSerializer
)
from .models import Artifact, Institution
from rest_framework.response import Response
from django.db.models import Q
from .permissions import IsFuncionarioPermission
import math


class ArtifactDetailAPIView(generics.RetrieveAPIView):
    queryset = Artifact.objects.all()
    serializer_class = ArtifactSerializer


class ArtifactListAPIView(generics.ListAPIView):
    serializer_class = ArtifactSerializer

    def get_queryset(self):
        return Artifact.objects.all()

    def get_serializer_context(self):
        return {"request": self.request}

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response({"status": "success", "data": serializer.data})


class ArtifactCreateAPIView(generics.CreateAPIView):
    queryset = Artifact.objects.all()
    serializer_class = NewArtifactSerializer
    permission_classes = [permissions.IsAdminUser, IsFuncionarioPermission]


class ArtifactDestroyAPIView(generics.DestroyAPIView):
    queryset = Artifact.objects.all()
    serializer_class = ArtifactSerializer
    lookup_field = "pk"


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 9

    def get_paginated_response(self, data):
        return Response(
            {
                "current_page": int(self.request.query_params.get("page", 1)),
                "total": self.page.paginator.count,
                "per_page": self.page_size,
                "total_pages": math.ceil(self.page.paginator.count / self.page_size),
                "data": data,
            }
        )


class CatalogAPIView(generics.ListAPIView):
    serializer_class = CatalogSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = Artifact.objects.all()

        # Filter by query parameters
        description = self.request.query_params.get("query", None)
        culture = self.request.query_params.get("culture", None)
        shape = self.request.query_params.get("shape", None)
        tags = self.request.query_params.get("tags", None)

        q_objects = Q()

        # Case insensitive search
        if description is not None:
            q_objects &= Q(description__icontains=description)
        if culture is not None:
            q_objects &= Q(id_culture__name__iexact=culture)
        if shape is not None:
            q_objects &= Q(id_shape__name__iexact=shape)
        if tags is not None:
            for tag in tags.split(","):
                q_objects &= Q(id_tags__name__iexact=tag.strip())

        return queryset.filter(q_objects)

    def get_serializer_context(self):
        return {"request": self.request}

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response({"status": "success", "data": serializer.data})


class ArtifactUpdateAPIView(generics.UpdateAPIView):
    queryset = Artifact.objects.all()
    serializer_class = UpdateArtifactSerializer
    lookup_field = 'pk'
    
    def patch(self, request, *args, **kwargs):
        artifactModel_object = self.get_object()
        serializer = UpdateArtifactSerializer(
            artifactModel_object,
            data=request.data,
            partial=False,
            context={"request": request},
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data})
        return Response({"status": "error", "data": serializer.errors})

class InstitutionAPIView(generics.ListCreateAPIView):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    lookup_field = 'pk'
    
class InstitutionDetailAPIView(generics.RetrieveAPIView):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    lookup_field = 'pk'        