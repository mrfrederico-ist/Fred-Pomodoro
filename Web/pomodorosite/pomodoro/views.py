from django.shortcuts import render


def index(request):
    return render(request, 'pomodoro/index.html')


def tasks(request):
    return render(request, 'pomodoro/tasks.html')


def settings(request):
    return render(request, 'pomodoro/settings.html')
