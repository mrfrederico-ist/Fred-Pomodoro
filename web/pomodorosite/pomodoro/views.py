from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import generics
from rest_framework import permissions

from .models import Task, Pomodoro, Setting
from . import serializers


def index(request):
    return render(request, 'pomodoro/index.html')


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = (permissions.IsAdminUser,)


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = (permissions.IsAdminUser,)


class TaskList(generics.ListCreateAPIView):
    serializer_class = serializers.TaskSerializer

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.TaskSerializer

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(owner=user)


# FIXME - Tasks from another users are shown in Django REST framework html form
class PomodoroList(generics.ListCreateAPIView):
    serializer_class = serializers.PomodoroSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Pomodoro.objects.filter(task__owner=user)


# FIXME - Tasks from another users are shown in Django REST framework html form
class PomodoroDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.PomodoroSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Pomodoro.objects.filter(task__owner=user)


class SettingList(generics.ListCreateAPIView):
    serializer_class = serializers.SettingSerializer

    def get_queryset(self):
        user = self.request.user
        return Setting.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class SettingDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.SettingSerializer

    def get_queryset(self):
        user = self.request.user
        return Setting.objects.filter(owner=user)

