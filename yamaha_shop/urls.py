from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from motos.views import react_app

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API v1 (DRF) - Prefijo versionado listo para API Gateway
    path('api/v1/', include('motos.api.urls', namespace='api-v1')),
]

# Static y media ANTES del catch-all para que Django las sirva
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# React SPA catch-all SIEMPRE al final
urlpatterns += [re_path(r'^.*$', react_app, name='react-app')]
