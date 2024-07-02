from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
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
    CustomUser,
)
from .forms import CustomUserCreationForm, CustomUserChangeForm


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = [
        "username",
        "email",
        "role",
        "institution",
        "rut",
        "is_staff",
        "is_active",
        "is_superuser",
        "get_groups",
    ]
    list_filter = UserAdmin.list_filter + ("role",)
    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ("role", "rut", "institution")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {"fields": ("role", "rut", "institution")}),
    )

    def get_groups(self, obj):
        return ", ".join([group.name for group in obj.groups.all()])

    get_groups.short_description = "Groups"

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        obj.update_group()

    def response_change(self, request, obj):
        response = super().response_change(request, obj)
        obj.update_group()
        return response


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


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Shape, ShapeAdmin)
admin.site.register(Culture, CultureAdmin)
admin.site.register(Artifact, ArtifactAdmin)
admin.site.register(Model)
admin.site.register(Thumbnail)
admin.site.register(Image)
admin.site.register(Institution)
admin.site.register(ArtifactRequester)
