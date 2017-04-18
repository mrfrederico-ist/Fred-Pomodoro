from django.contrib.auth.models import User
from django.forms import CharField, PasswordInput, TextInput
from django.contrib.auth.forms import UserCreationForm, UsernameField


class CreateUserForm(UserCreationForm):
    password1 = CharField(widget=PasswordInput(attrs={
        'class': 'form-control', 'placeholder': 'Password'
    }))
    password2 = CharField(widget=PasswordInput(attrs={
        'class': 'form-control', 'placeholder': 'Password (repeat)'
    }))

    class Meta:
        model = User
        fields = ("username",)
        field_classes = {'username': UsernameField}
        widgets = {'username': TextInput(attrs={
            'class': 'form-control', 'placeholder': 'Username'
        })}
