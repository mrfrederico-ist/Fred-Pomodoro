from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse

from .forms import TaskForm


def tasks(request):
    if request.method == 'POST':
        form_add_task = TaskForm(request.POST)

        if form_add_task.is_valid():
            print(form_add_task.cleaned_data['name'])

            return HttpResponseRedirect(reverse('tasks'))
    else:
        form_add_task = TaskForm()

    context = {
        'form_add_task': form_add_task,
    }

    return render(request, 'pomodoro/tasks.html', context)


def index(request):

    return render(request, 'pomodoro/index.html')


def settings(request):

    return render(request, 'pomodoro/settings.html')

