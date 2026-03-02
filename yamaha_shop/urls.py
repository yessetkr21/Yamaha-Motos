from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from motos.views import (
    home_view, MotoListView, MotoDetailView,
    registro_view, login_view, logout_view,
    agendar_cita_view,
    mis_citas_view, cancelar_cita_view,
)

urlpatterns = [
    # Paginas principales
    path('', home_view, name='home'),
    path('motos/', MotoListView.as_view(), name='moto-lista'),
    path('motos/<int:pk>/', MotoDetailView.as_view(), name='moto-detail'),

    # Autenticacion de cliente
    path('registro/', registro_view, name='registro'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),

    # Citas
    path('citas/agendar/', agendar_cita_view, name='agendar-cita'),
    path('motos/<int:pk>/agendar-cita/', agendar_cita_view, name='agendar-cita-moto'),
    path('mis-citas/', mis_citas_view, name='mis-citas'),
    path('citas/<int:pk>/cancelar/', cancelar_cita_view, name='cancelar-cita'),

    # Admin
    path('admin/', admin.site.urls),

    # API v1 (DRF) - Prefijo versionado listo para API Gateway
    path('api/v1/', include('motos.api.urls', namespace='api-v1')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
