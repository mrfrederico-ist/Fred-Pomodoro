from django.db import models


class Task(models.Model):
    owner = models.ForeignKey('auth.User', related_name='tasks', on_delete=models.CASCADE)
    name = models.CharField(max_length=64, null=False, blank=False)
    finished_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('owner', 'name',)

    def is_completed(self):
        return self.finished_date is not None
    is_completed.admin_order_field = 'finished_date'
    is_completed.boolean = True
    is_completed.short_description = 'Completed'

    def __str__(self):
        return self.name


class Pomodoro(models.Model):
    task = models.ForeignKey(Task, related_name='pomodoros', on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    duration = models.IntegerField()

    def __str__(self):
        return 'task:{}'.format(self.task.name)


class Setting(models.Model):
    owner = models.ForeignKey('auth.User', related_name='settings', on_delete=models.CASCADE)
    name = models.CharField(max_length=64, null=False, blank=False)
    pomodoro_duration = models.IntegerField(default=25, null=False, blank=False)
    short_break = models.IntegerField(default=5, null=False, blank=False)
    long_break = models.IntegerField(default=30, null=False, blank=False)
    long_break_after = models.IntegerField(default=4, null=False, blank=False)
    daily_target = models.IntegerField(default=14, null=False, blank=False)

    class Meta:
        unique_together = ('owner', 'name',)

    def __str__(self):
        return self.name
