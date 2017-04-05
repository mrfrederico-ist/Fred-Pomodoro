from django.db import models


class Task(models.Model):
    name = models.CharField(max_length=64, unique=True)
    completed = models.BooleanField()
    finished_date = models.DateField()


class Pomodoro(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    duration = models.IntegerField()
