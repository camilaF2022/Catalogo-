import os
from django.conf import settings
from .authentication import TokenAuthentication
from rest_framework import generics, permissions
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import (
    ArtifactRequesterSerializer,
    ArtifactSerializer,
    CatalogSerializer,
    UpdateArtifactSerializer,
    InstitutionSerializer,
    ShapeSerializer,
    TagSerializer,
    CultureSerializer,
)
from .models import (
    Artifact,
    ArtifactRequester,
    CustomUser,
    Institution,
    Image,
    Shape,
    Tag,
    Culture,
    Model,
    Thumbnail,
)
from django.db.models import Q
from django.core.files import File
from django.http import HttpResponse
from .permissions import IsFuncionarioPermission, IsAdminPermission
import math
import zipfile
from io import BytesIO
import logging

logger = logging.getLogger(__name__)


class ArtifactDetailAPIView(generics.RetrieveAPIView):
    queryset = Artifact.objects.all()
    serializer_class = ArtifactSerializer
    permission_classes = [permissions.AllowAny]


class MetadataListAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        shapes = Shape.objects.all()
        tags = Tag.objects.all()
        cultures = Culture.objects.all()

        # Serialize the data
        shape_serializer = ShapeSerializer(shapes, many=True)
        tag_serializer = TagSerializer(tags, many=True)
        culture_serializer = CultureSerializer(cultures, many=True)

        # Function to change 'name' key to 'value'
        def rename_key(lst):
            return [{"id": item["id"], "value": item["name"]} for item in lst]

        # Combine the data with 'name' key changed to 'value'
        data = {
            "shapes": rename_key(shape_serializer.data),
            "tags": rename_key(tag_serializer.data),
            "cultures": rename_key(culture_serializer.data),
        }

        return Response({"data": data}, status=status.HTTP_200_OK)


class ArtifactDownloadAPIView(generics.RetrieveAPIView, generics.CreateAPIView):
    queryset = Artifact.objects.all()
    serializer_class = ArtifactSerializer
    lookup_field = "pk"
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        logger.info(
            "Creating new artifact requester for artifact {}".format(kwargs.get("pk"))
        )
        # If the body is empty, retrieve info from backend
        if not request.data:
            token = request.headers.get("Authorization")
            try:
                token_instance = Token.objects.get(key=token.split(" ")[1])
            except Token.DoesNotExist:
                return Response(
                    {"detail": "Se requiere iniciar sesión nuevamente"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            username = token_instance.user
            user = CustomUser.objects.get(username=username)
            name = user.first_name + " " + user.last_name
            requester = ArtifactRequester.objects.create(
                name=name,
                rut=user.rut,
                email=user.email,
                is_registered=True,
                institution=user.institution if user.institution else None,
                artifact=Artifact.objects.get(pk=kwargs.get("pk")),
            )
            serializer = ArtifactRequesterSerializer(requester)
        else:
            requester = ArtifactRequester.objects.create(
                name=request.data.get("fullName"),
                rut=request.data.get("rut"),
                email=request.data.get("email"),
                comments=request.data.get("comments"),
                is_registered=False,
                institution=Institution.objects.get(pk=request.data.get("institution")),
                artifact=Artifact.objects.get(pk=kwargs.get("pk")),
            )
            serializer = ArtifactRequesterSerializer(requester)
        return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        logger.info(f"Downloading artifact {kwargs.get('pk')}")
        pk = kwargs.get("pk")
        if pk is not None:
            try:
                artifact = Artifact.objects.get(pk=pk)
            except Artifact.DoesNotExist:
                return HttpResponse(status=404)

            buffer = BytesIO()

            with zipfile.ZipFile(buffer, "w") as zipf:
                if artifact.id_thumbnail:
                    zipf.write(
                        artifact.id_thumbnail.path.path,
                        f"thumbnail/{artifact.id_thumbnail.path}",
                    )

                zipf.write(
                    artifact.id_model.texture.path,
                    f"model/{artifact.id_model.texture.name}",
                )
                zipf.write(
                    artifact.id_model.object.path,
                    f"model/{artifact.id_model.object.name}",
                )
                zipf.write(
                    artifact.id_model.material.path,
                    f"model/{artifact.id_model.material.name}",
                )

                images = Image.objects.filter(id_artifact=artifact.id)
                for image in images:
                    zipf.write(image.path.path, f"model/{image.path}")

            buffer.seek(0)

            response = HttpResponse(buffer, content_type="application/zip")
            response["Content-Disposition"] = f"attachment; filename=artifact_{pk}.zip"
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
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Artifact.objects.all().order_by("id")

        # Filter by query parameters
        description = self.request.query_params.get("query", None)
        culture = self.request.query_params.get("culture", None)
        shape = self.request.query_params.get("shape", None)
        tags = self.request.query_params.get("tags", None)

        q_objects = Q()

        # Case insensitive search
        if description is not None:
            # Check if the description is in the artifact's description
            # or the Id of the artifact
            q_objects &= Q(description__icontains=description) | Q(
                id__icontains=description
            )
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
            return Response({**page_data})

        serializer = self.get_serializer(queryset, many=True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)


class ArtifactCreateUpdateAPIView(generics.GenericAPIView):
    queryset = Artifact.objects.all()
    serializer_class = UpdateArtifactSerializer
    lookup_field = "pk"
    authentication_classes = [TokenAuthentication]
    permission_classes = [
        permissions.IsAuthenticated & (IsFuncionarioPermission | IsAdminPermission)
    ]

    def get_object(self):
        pk = self.kwargs.get("pk")
        if pk is not None:
            return super().get_object()
        return None

    def post(self, request, *args, **kwargs):
        return self.create_or_update(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.create_or_update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.create_or_update(request, *args, **kwargs, partial=True)

    def create_or_update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        if instance is None:
            logger.info("Creating new artifact")
            serializer = self.get_serializer(data=request.data)
            success_status = status.HTTP_201_CREATED
        else:
            logger.info(f"Updating artifact {instance.id}")
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial
            )
            success_status = status.HTTP_200_OK

        serializer.is_valid(raise_exception=True)

        # Save the instance first
        instance = serializer.save()

        logger.info(f"Handle file uploads for artifact {instance.id}")
        # Handle file uploads
        self.handle_file_uploads(instance, request.FILES, request.data)

        # Save again to ensure all related objects are properly linked
        instance.save()

        return Response(
            {"data": serializer.data},
            status=success_status,
        )

    def perform_create_or_update(self, serializer):
        serializer.save()

    def handle_file_uploads(self, instance, files, data):
        # Handle thumbnail
        thumbnail_data = files.get("new_thumbnail")
        if thumbnail_data:
            # Upload file
            thumbnail_file = File(thumbnail_data, name=thumbnail_data.name)
            # Create Thumbnail instance
            thumbnail = Thumbnail.objects.create(path=thumbnail_file)
            logger.info(f"Thumbnail created: {thumbnail.path}")
            # Set the thumbnail
            instance.id_thumbnail = thumbnail
        else:
            thumbnail_name = data.get("thumbnail", None)
            if thumbnail_name:
                thumbnail_path = os.path.join(settings.THUMBNAILS_ROOT, thumbnail_name)
                thumbnail = Thumbnail.objects.get(path=thumbnail_path)
                instance.id_thumbnail = thumbnail
                logger.info(f"Thumbnail kept: {thumbnail.path}")
            else:
                instance.id_thumbnail = None
                logger.info("Thumbnail removed")

        # Handle model files
        # New files
        new_texture_file = files.get("model[new_texture]")
        new_object_file = files.get("model[new_object]")
        new_material_file = files.get("model[new_material]")

        new_texture_instance, new_object_instance, new_material_instance = (
            None,
            None,
            None,
        )
        if new_texture_file:
            new_texture_instance = File(new_texture_file, name=new_texture_file.name)
            logger.info(f"New texture file: {new_texture_instance}")
        if new_object_file:
            new_object_instance = File(new_object_file, name=new_object_file.name)
            logger.info(f"New object file: {new_object_instance}")
        if new_material_file:
            new_material_instance = File(new_material_file, name=new_material_file.name)
            logger.info(f"New material file: {new_material_instance}")

        # Update Model instance
        # It allows to create a new model with only the new files
        model, created = Model.objects.get_or_create(
            texture=new_texture_instance if new_texture_instance else instance.id_model.texture,
            object=new_object_instance if new_object_instance else instance.id_model.object,
            material=new_material_instance if new_material_instance else instance.id_model.material,
        )
        if created:
            logger.info(
                f"Model created: {model.texture}, {model.object}, {model.material}"
            )
        else:
            logger.info(
                f"Model updated: {model.texture}, {model.object}, {model.material}"
            )
        # Set the model
        instance.id_model = model

        # Handle images
        # Get the images that are already uploaded and should be kept, and the new images to be uploaded
        # Old images are unlinked. This way we can set an empty list of images if we want to remove all images

        # First we get the images linked to the artifact
        old_images = Image.objects.filter(id_artifact=instance)
        # We update them so they are not linked to the artifact anymore
        for image in old_images:
            image.id_artifact = None
            image.save()
            logger.info(f"Image unlinked: {image.path}")

        # Now we recover the images that should be kept
        keep_images = data.getlist(
            "images", []
        )  # images are paths from photos already uploaded
        for image_name in keep_images:
            # Update instances
            image_path = os.path.join(settings.IMAGES_ROOT, image_name)
            image = Image.objects.get(path=image_path)
            image.id_artifact = instance
            image.save()
            logger.info(f"Image updated: {image.path}")

        new_images = files.getlist(
            "new_images", []
        )  # new_images are files to be uploaded
        for image_data in new_images:
            image_file = File(image_data, name=image_data.name)
            # Create Image instance
            image = Image.objects.create(id_artifact=instance, path=image_file)
            logger.info(f"Image created: {image.path}")


class InstitutionAPIView(generics.ListCreateAPIView):
    queryset = Institution.objects.all().order_by("id")
    serializer_class = InstitutionSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        institutions = Institution.objects.all()

        # Serialize the data
        institution_serializer = InstitutionSerializer(institutions, many=True)

        # Function to change 'name' key to 'value'
        def rename_key(lst):
            return [{"id": item["id"], "value": item["name"]} for item in lst]

        data = rename_key(institution_serializer.data)

        return Response({"data": data}, status=status.HTTP_200_OK)
