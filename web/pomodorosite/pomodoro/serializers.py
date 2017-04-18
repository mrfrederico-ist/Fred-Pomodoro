from .models import Task, Pomodoro, Setting
from rest_framework import serializers


class PomodoroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pomodoro
        fields = ('id', 'task', 'start_date', 'duration')


class TaskSerializer(serializers.ModelSerializer):
    pomodoros = serializers.PrimaryKeyRelatedField(many=True, queryset=Pomodoro.objects.all())

    class Meta:
        model = Task
        fields = ('id', 'name', 'finished_date', 'is_completed', 'pomodoros')


class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = (
            'url',
            'name',
            'pomodoro_duration',
            'short_break',
            'long_break',
            'long_break_after',
            'daily_target'
        )
