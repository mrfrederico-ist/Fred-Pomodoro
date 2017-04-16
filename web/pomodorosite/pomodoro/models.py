from django.db import models


class Task(models.Model):
    name = models.CharField(max_length=64, unique=True, null=False, blank=False)
    finished_date = models.DateField(null=True, blank=True)

    def is_completed(self):
        return self.finished_date is not None
    is_completed.admin_order_field = 'finished_date'
    is_completed.boolean = True
    is_completed.short_description = 'Completed'

    def __str__(self):
        return self.name


class Pomodoro(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    duration = models.IntegerField()

    def __str__(self):
        return 'task:{}'.format(self.task.name)


class Setting(models.Model):
    name = models.CharField(max_length=64, unique=True, null=False, blank=False)
    pomodoro_duration = models.IntegerField(default=25)
    short_break = models.IntegerField(default=5)
    long_break = models.IntegerField(default=30)
    long_break_after = models.IntegerField(default=4)
    daily_target = models.IntegerField(default=14)

    def __str__(self):
        return self.name
