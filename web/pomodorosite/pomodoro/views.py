from django.conf import settings
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.contrib.auth import authenticate, login


from . import forms


@login_required
def index(request):

    return render(request, 'pomodoro/index.html', {'user': request.user})


def create_account(request):
    if request.method == 'POST':
        form = forms.CreateUserForm(request.POST)

        if form.is_valid():
            user = form.save()

            group = Group.objects.get(name='pomodoro')
            group.user_set.add(user)

            authenticate(request, username=user.username, password=user.password)
            login(request, user=user)

            return redirect(settings.LOGIN_REDIRECT_URL)
    else:
        form = forms.CreateUserForm()

    return render(request, 'pomodoro/create_account.html', {'form': form})

