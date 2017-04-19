from django.conf.urls import url
from django.contrib.auth import views as auth_views
from rest_framework.urlpatterns import format_suffix_patterns

from pomodoro import views, views_api

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^login/$', auth_views.login, {'template_name': 'pomodoro/login.html'}, name='login'),
    url(r'^logout/$', auth_views.logout_then_login, name='logout'),
    url(r'^create-account/$', views.create_account, name='create_account'),
]

urlpatterns += [
    url(r'^api/$', views_api.api_root),
    url(r'^api/users/$', views_api.UserList.as_view(), name='user-list'),
    url(r'^api/users/(?P<pk>[0-9]+)/$', views_api.UserDetail.as_view(), name='user-detail'),
    url(r'^api/tasks/$', views_api.TaskList.as_view(), name='task-list'),
    url(r'^api/tasks/(?P<pk>[0-9]+)/$', views_api.TaskDetail.as_view(), name='task-detail'),
    url(r'^api/pomodoros/$', views_api.PomodoroList.as_view(), name='pomodoro-list'),
    url(r'^api/pomodoros/(?P<pk>[0-9]+)/$', views_api.PomodoroDetail.as_view(), name='pomodoro-detail'),
    url(r'^api/settings/$', views_api.SettingList.as_view(), name='setting-list'),
    url(r'^api/settings/(?P<pk>[0-9]+)/$', views_api.SettingDetail.as_view(), name='setting-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
