from rest_framework import permissions


class IsFuncionarioPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.filter(name="Funcionario").exists()


class IsAdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user and request.user.groups.filter(name="Administrador").exists()
        )
