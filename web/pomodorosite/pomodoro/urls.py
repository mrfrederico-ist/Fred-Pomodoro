from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^tasks/$', views.tasks, name='tasks'),
    url(r'^$', views.index, name='index'),
    url(r'^settings/$', views.settings, name='settings'),
]
