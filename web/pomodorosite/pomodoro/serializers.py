from django.contrib.auth.models import User
from .models import Task, Pomodoro, Setting
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator


class UserSerializer(serializers.HyperlinkedModelSerializer):
    tasks = serializers.HyperlinkedRelatedField(many=True, view_name='task-detail', read_only=True)
    settings = serializers.HyperlinkedRelatedField(many=True, view_name='setting-detail', read_only=True)

    class Meta:
        model = User
        fields = ('url', 'id', 'username', 'tasks', 'settings')


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    pomodoros = serializers.HyperlinkedRelatedField(many=True, view_name='pomodoro-detail', read_only=True)

    class Meta:
        model = Task
        fields = ('url', 'id', 'owner', 'name', 'finished_date', 'pomodoros')
        validators = [
            UniqueTogetherValidator(
                queryset=Task.objects.all(),
                fields=('owner', 'name'),
                message='task with this name already exists',
            )
        ]


class PomodoroSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Pomodoro
        fields = ('task', 'start_date', 'duration')


class SettingSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Setting
        fields = (
            'url', 'id', 'owner', 'name', 'pomodoro_duration',
            'short_break', 'long_break', 'long_break_after', 'daily_target'
        )
        validators = [
            UniqueTogetherValidator(
                queryset=Task.objects.all(),
                fields=('owner', 'name'),
                message='setting with this name already exists',
            )
        ]
