from rest_framework import viewsets, generics, permissions, authentication
from .serializers import (
    ArtifactSerializer,
    NewArtifactSerializer,
)
from .models import Artifact
from .serializers import CatalogSerializer
from rest_framework.response import Response
from django.db.models import Q


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


class ArtifactDestroyAPIView(generics.DestroyAPIView):
    queryset = Artifact.objects.all()
    serializer_class = ArtifactSerializer
    lookup_field = "pk"


class CatalogAPIView(generics.ListAPIView):
    serializer_class = CatalogSerializer

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
