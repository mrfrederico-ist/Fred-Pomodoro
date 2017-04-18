from django.shortcuts import render
from rest_framework import generics

from .models import Task, Setting
from .serializers import TaskSerializer, SettingSerializer


def index(request):
    return render(request, 'pomodoro/index.html')


class TaskList(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class SettingList(generics.ListCreateAPIView):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer


class SettingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer

