from django.conf import settings
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from . import forms


@login_required
def index(request):
    return render(request, 'pomodoro/index.html')


def create_account(request):
    if request.method == 'POST':
        form = forms.CreateUserForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect(settings.LOGIN_REDIRECT_URL)
    else:
        form = forms.CreateUserForm()

    return render(request, 'pomodoro/create_account.html', {'form': form})

