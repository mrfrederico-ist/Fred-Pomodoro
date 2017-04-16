from django.contrib import admin

from .models import Task, Pomodoro, Setting


class PomodoroInline(admin.TabularInline):
    model = Pomodoro
    extra = 0


class TaskAdmin(admin.ModelAdmin):
    list_display = ('name', 'finished_date', 'is_completed')
    list_filter = ['finished_date']
    search_fields = ['name']
    fieldsets = [
        (None, {'fields': ['name']}),
        ('Status information', {'fields': ['finished_date']}),
    ]
    inlines = [PomodoroInline]

admin.site.register(Task, TaskAdmin)
admin.site.register(Setting)

