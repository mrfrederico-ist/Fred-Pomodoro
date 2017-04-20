from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, UsernameField
from django import forms


class CreateUserForm(UserCreationForm):
    password1 = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': 'form-control', 'placeholder': 'Password'
    }))
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': 'form-control', 'placeholder': 'Password (repeat)'
    }))

    class Meta:
        model = User
        fields = ('username', 'email')
        field_classes = {'username': UsernameField, 'email': forms.EmailField}
        widgets = {
            'username': forms.TextInput(attrs={
                'class': 'form-control', 'placeholder': 'Username'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control', 'placeholder': 'Email'
            })
        }

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user
