from django.contrib.auth.models import User
from .models import Task, Pomodoro, Setting
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    tasks = serializers.PrimaryKeyRelatedField(many=True, queryset=Task.objects.all())
    settings = serializers.PrimaryKeyRelatedField(many=True, queryset=Setting.objects.all())

    class Meta:
        model = User
        fields = ('id', 'username', 'tasks', 'settings')


class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    pomodoros = serializers.PrimaryKeyRelatedField(many=True, queryset=Pomodoro.objects.all())

    class Meta:
        model = Task
        fields = ('id', 'owner', 'name', 'finished_date', 'pomodoros')


class PomodoroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pomodoro
        fields = ('task', 'start_date', 'duration')


class SettingSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Setting
        fields = (
            'id', 'owner', 'name', 'pomodoro_duration', 'short_break', 'long_break', 'long_break_after', 'daily_target'
        )
