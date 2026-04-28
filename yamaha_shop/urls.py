from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve
from motos.views import react_app

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('motos.api.urls', namespace='api-v1')),
    # Serve media always regardless of DEBUG
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

# React SPA catch-all al final
urlpatterns += [re_path(r'^.*$', react_app, name='react-app')]
