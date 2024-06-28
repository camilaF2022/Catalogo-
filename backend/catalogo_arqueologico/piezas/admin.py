from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Tag, Shape, Culture, Artifact, CustomUser


class CustomUserAdmin(UserAdmin):
    model=CustomUser
    list_display=['username','email','role','institution','rut','is_staff','is_active']

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
