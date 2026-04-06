from django.urls import path
from .moto_views import MotoListAPIView, MotoDetailAPIView
from .cliente_views import ClienteListCreateAPIView, ClienteDetailAPIView, ClienteLoginAPIView
from .pedido_views import (
    PedidoListCreateAPIView, PedidoDetailAPIView,
    PedidoCambiarEstadoAPIView, PedidoFacturaAPIView,
)
from .cita_views import (
    CitaListCreateAPIView, CitaDetailAPIView,
    CitaConfirmarAPIView, CitaCancelarAPIView,
)
from .pago_views import (
    PagoListAPIView, PagoDetailAPIView,
    PagoIniciarAPIView, PagoConfirmarRetornoAPIView,
)

app_name = 'api'

urlpatterns = [
    # Motos
    path('motos/', MotoListAPIView.as_view(), name='moto-list'),
    path('motos/<int:pk>/', MotoDetailAPIView.as_view(), name='moto-detail'),

    # Clientes
    path('clientes/', ClienteListCreateAPIView.as_view(), name='cliente-list-create'),
    path('clientes/login/', ClienteLoginAPIView.as_view(), name='cliente-login'),
    path('clientes/<int:pk>/', ClienteDetailAPIView.as_view(), name='cliente-detail'),

    # Pedidos
    path('pedidos/', PedidoListCreateAPIView.as_view(), name='pedido-list-create'),
    path('pedidos/<int:pk>/', PedidoDetailAPIView.as_view(), name='pedido-detail'),
    path('pedidos/<int:pk>/estado/', PedidoCambiarEstadoAPIView.as_view(), name='pedido-cambiar-estado'),
    path('pedidos/<int:pk>/factura/', PedidoFacturaAPIView.as_view(), name='pedido-factura'),

    # Citas
    path('citas/', CitaListCreateAPIView.as_view(), name='cita-list-create'),
    path('citas/<int:pk>/', CitaDetailAPIView.as_view(), name='cita-detail'),
    path('citas/<int:pk>/confirmar/', CitaConfirmarAPIView.as_view(), name='cita-confirmar'),
    path('citas/<int:pk>/cancelar/', CitaCancelarAPIView.as_view(), name='cita-cancelar'),

    # Pagos
    path('pagos/', PagoListAPIView.as_view(), name='pago-list'),
    path('pagos/iniciar/', PagoIniciarAPIView.as_view(), name='pago-iniciar'),
    path('pagos/confirmar-retorno/', PagoConfirmarRetornoAPIView.as_view(), name='pago-confirmar-retorno'),
    path('pagos/<int:pk>/', PagoDetailAPIView.as_view(), name='pago-detail'),
]
