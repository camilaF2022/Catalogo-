from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from .serializers import (
    ArtifactSerializer,
    NewArtifactSerializer,
    CatalogSerializer,
    UpdateArtifactSerializer,
    InstitutionSerializer,
    ShapeSerializer,
    TagSerializer,
    CultureSerializer,
)
from .models import Artifact, Institution, Image, Shape, Tag, Culture
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Q
import math
import zipfile
from django.http import HttpResponse, FileResponse
from io import BytesIO

class ArtifactDetailAPIView(generics.RetrieveAPIView):
    queryset = Artifact.objects.all()
    serializer_class = ArtifactSerializer

    


class MetadataListAPIView(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        shapes = Shape.objects.all()
        tags = Tag.objects.all()
        cultures = Culture.objects.all()

        # Serialize the data
        shape_serializer = ShapeSerializer(shapes, many=True)
        tag_serializer = TagSerializer(tags, many=True)
        culture_serializer = CultureSerializer(cultures, many=True)

        # Combine the data
        data = {
            "shapes": shape_serializer.data,
            "tags": tag_serializer.data,
            "cultures": culture_serializer.data,
        }

        return Response({"status":"HTTP_OK","data":data})


class ArtifactCreateAPIView(generics.CreateAPIView):
    queryset = Artifact.objects.all()
    serializer_class = NewArtifactSerializer
    lookup_field = "pk"

    def post(self, request, *args, **kwargs):
        serializer = NewArtifactSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "HTTP_OK", "data": serializer.data})
        return Response({"status": "error", "data": serializer.errors})


class ArtifactDestroyAPIView(generics.DestroyAPIView):
    queryset = Artifact.objects.all()
    serializer_class = ArtifactSerializer
    lookup_field = "pk"


class ArtifactDownloadAPIView(generics.RetrieveAPIView):
    queryset = Artifact.objects.all()
    serializer_class = ArtifactSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        if pk is not None:
            try:
                artifact = Artifact.objects.get(pk=pk)
            except Artifact.DoesNotExist:
                return HttpResponse(status=404)
                
                
            buffer = BytesIO()

            with zipfile.ZipFile(buffer, 'w') as zipf:
                if artifact.id_thumbnail:
                    zipf.write(artifact.id_thumbnail.path.path, f'thumbnail/{artifact.id_thumbnail.path}')
                
                zipf.write(artifact.id_model.texture.path, f'model/{artifact.id_model.texture.name}')
                zipf.write(artifact.id_model.object.path, f'model/{artifact.id_model.object.name}')
                zipf.write(artifact.id_model.material.path, f'model/{artifact.id_model.material.name}')
                    
                images = Image.objects.filter(id_artifact=artifact.id)
                for image in images:
                    zipf.write(image.path.path, f'model/{image.path}' )
                
            buffer.seek(0)

            response = HttpResponse(buffer, content_type='application/zip')
            response['Content-Disposition'] = f'attachment; filename=artifact_{pk}.zip'
            return response
            
                
            


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
            page_data = self.get_paginated_response(serializer.data).data
            return Response({**{"status":"HTTP_OK"},**page_data})

        serializer = self.get_serializer(queryset, many=True)
        return Response({"status": "HTTP_OK", "data": serializer.data})


class ArtifactUpdateAPIView(generics.UpdateAPIView):
    queryset = Artifact.objects.all()
    serializer_class = UpdateArtifactSerializer
    lookup_field = "pk"

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
            return Response({"status": "HTTP_OK", "data": serializer.data})
        return Response({"status": "error", "data": serializer.errors})


class InstitutionAPIView(generics.ListCreateAPIView):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    lookup_field = "pk"


class InstitutionDetailAPIView(generics.RetrieveAPIView):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    lookup_field = "pk"
