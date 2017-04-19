from django.contrib.auth.models import User
from .models import Task, Pomodoro, Setting
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    tasks = serializers.HyperlinkedRelatedField(many=True, view_name='task-detail', read_only=True)
    settings = serializers.HyperlinkedRelatedField(many=True, view_name='setting-detail', read_only=True)

    class Meta:
        model = User
        fields = ('url', 'id', 'username', 'tasks', 'settings')


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    pomodoros = serializers.HyperlinkedRelatedField(many=True, view_name='pomodoro-detail', read_only=True)

    class Meta:
        model = Task
        fields = ('url', 'id', 'owner', 'name', 'finished_date', 'pomodoros')


class PomodoroSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Pomodoro
        fields = ('task', 'start_date', 'duration')


class SettingSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Setting
        fields = (
            'url', 'id', 'owner', 'name', 'pomodoro_duration',
            'short_break', 'long_break', 'long_break_after', 'daily_target'
        )
