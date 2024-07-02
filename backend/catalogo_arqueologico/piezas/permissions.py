from rest_framework import permissions


class IsFuncionarioPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.filter(name="Funcionario").exists()


class IsAdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user and request.user.groups.filter(name="Administrador").exists()
        )


class GetPostPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow any user for GET requests
        if request.method == "GET":
            return True
        # For POST, require authentication and proper permissions
        elif request.method == "POST":
            return request.user and request.user.is_authenticated and (
                request.user.groups.filter(name="Administrador").exists()
                or request.user.groups.filter(name="Funcionario").exists()
            )
        return False
