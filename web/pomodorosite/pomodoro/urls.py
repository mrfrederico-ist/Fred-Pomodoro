from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns

from pomodoro import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
]

urlpatterns += [
    url(r'^api/users/$', views.UserList.as_view()),
    url(r'^api/users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
    url(r'^api/tasks/$', views.TaskList.as_view()),
    url(r'^api/tasks/(?P<pk>[0-9]+)/$', views.TaskDetail.as_view()),
    url(r'^api/settings/$', views.SettingList.as_view()),
    url(r'^api/settings/(?P<pk>[0-9]+)/$', views.SettingDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
