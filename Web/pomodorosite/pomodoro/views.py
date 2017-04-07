from django.shortcuts import render


def index(request):
    """
    Display Pomodoro home page.
     **Template**
     :template:`pomodoro/index.html`
    """
    return render(request, 'pomodoro/index.html')
