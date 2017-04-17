from django.forms import ModelForm, TextInput
from .models import Task


class TaskForm(ModelForm):

    class Meta:
        model = Task
        fields = ['name']
        widgets = {
            'name': TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Task name',
            })
        }
