from django.contrib import admin
from .models import Metadata, Media, PiezaArq
from import_export.admin import ImportExportModelAdmin
# Register your models here.
class RecordMetadataAdmin(ImportExportModelAdmin):
    list_display = ['type', 'name'] #type = 1 is Tag, type = 2 is Culture, type = 3 is Form

admin.site.register(Metadata,RecordMetadataAdmin)

admin.site.register(Media)
admin.site.register(PiezaArq)