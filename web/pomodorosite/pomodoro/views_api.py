from django.contrib.auth.models import User
from rest_framework import permissions
from rest_framework import viewsets

from .models import Task, Pomodoro, Setting
from . import serializers


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = (permissions.IsAdminUser,)


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = serializers.TaskSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PomodoroViewSet(viewsets.ModelViewSet):
    queryset = Pomodoro.objects.all()
    serializer_class = serializers.PomodoroSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Pomodoro.objects.filter(task__owner=user)


class SettingViewSet(viewsets.ModelViewSet):
    queryset = Setting.objects.all()
    serializer_class = serializers.SettingSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Setting.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
