from django.conf.urls import url
from django.contrib.auth import views as auth_views
from rest_framework.urlpatterns import format_suffix_patterns

from pomodoro import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^login/$', auth_views.login, {'template_name': 'pomodoro/login.html'}, name='login'),
    url(r'^logout/$', auth_views.logout_then_login, name='logout'),
    url(r'^create-account/$', views.create_account, name='create_account'),
]

urlpatterns += [
    url(r'^api/users/$', views.UserList.as_view()),
    url(r'^api/users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
    url(r'^api/tasks/$', views.TaskList.as_view()),
    url(r'^api/tasks/(?P<pk>[0-9]+)/$', views.TaskDetail.as_view()),
    url(r'^api/pomodoros/$', views.PomodoroList.as_view()),
    url(r'^api/pomodoros/(?P<pk>[0-9]+)/$', views.PomodoroDetail.as_view()),
    url(r'^api/settings/$', views.SettingList.as_view()),
    url(r'^api/settings/(?P<pk>[0-9]+)/$', views.SettingDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
