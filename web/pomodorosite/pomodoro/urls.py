from django.conf.urls import url, include
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter

from pomodoro import views, views_api

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^login/$', auth_views.login, {'template_name': 'pomodoro/login.html'}, name='login'),
    url(r'^logout/$', auth_views.logout_then_login, name='logout'),
    url(r'^create-account/$', views.create_account, name='create_account'),
]

router = DefaultRouter()
router.register(r'users', views_api.UserViewSet)
router.register(r'tasks', views_api.TaskViewSet)
router.register(r'pomodoros', views_api.PomodoroViewSet)
router.register(r'settings', views_api.SettingViewSet)

urlpatterns += [
    url(r'^api/', include(router.urls)),
]
