from django.contrib import admin
from .models import (
    ArtifactRequester,
    Tag,
    Shape,
    Culture,
    Artifact,
    Model,
    Thumbnail,
    Image,
    Institution,
)


class TagAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_filter = ("name",)
    search_fields = ("name",)


class ShapeAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_filter = ("name",)
    search_fields = ("name",)


class CultureAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_filter = ("name",)
    search_fields = ("name",)


class ArtifactAdmin(admin.ModelAdmin):
    list_display = ("id", "description")
    list_filter = ("id",)
    search_fields = ("description",)


admin.site.register(Tag, TagAdmin)
admin.site.register(Shape, ShapeAdmin)
admin.site.register(Culture, CultureAdmin)
admin.site.register(Artifact, ArtifactAdmin)
admin.site.register(Model)
admin.site.register(Thumbnail)
admin.site.register(Image)
admin.site.register(Institution)
admin.site.register(ArtifactRequester)
