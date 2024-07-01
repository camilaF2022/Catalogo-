from rest_framework import permissions
from rest_framework.permissions import BasePermission
class  IsFuncionarioPermission(permissions.DjangoModelPermissions):
    perms_map = {
        'GET': ['%(app_label)s.view_%(model_name)s'],
        'OPTIONS': [],
        'HEAD': [],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        'PUT': ['%(app_label)s.change_%(model_name)s'],
        'PATCH': ['%(app_label)s.change_%(model_name)s'],
        'DELETE': ['%(app_label)s.delete_%(model_name)s'],
    }

    def has_permission(self, request, view):
        if not request.user.is_staff:
            return False
        return super().has_permission(request, view)
    

class IsAuthenticatedOrProvidesData(BasePermission):

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        required_fields = ['fullName', 'rut', 'email', 'description']        
        if request.method=='POST' and all(field in request.data for field in required_fields):
            return True

        return False

