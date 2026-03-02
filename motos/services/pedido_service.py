from django.utils import timezone
from motos.models import Pedido
from motos.builders.pedido_builder import PedidoBuilder


class PedidoService:
    """Servicio para operaciones relacionadas con pedidos (SRP)."""

    @staticmethod
    def crear_pedido(cliente, moto, cantidad: int = 1,
                     metodo_pago: str = 'tarjeta') -> Pedido:
        """Usa el patron Builder para construir un Pedido."""
        pedido = (PedidoBuilder()
            .set_cliente(cliente)
            .set_moto(moto)
            .set_cantidad(cantidad)
            .calcular_totales()
            .build())
        return pedido

    @staticmethod
    def obtener_pedido_por_pk(pk: int):
        try:
            return Pedido.objects.select_related(
                'cliente', 'moto'
            ).get(pk=pk)
        except Pedido.DoesNotExist:
            return None

    @staticmethod
    def actualizar_estado(pedido: Pedido, nuevo_estado: str) -> Pedido:
        """Valida transiciones de estado y actualiza."""
        transiciones_validas = {
            'pendiente': ['confirmado', 'cancelado'],
            'confirmado': ['en_preparacion', 'cancelado'],
            'en_preparacion': ['listo', 'cancelado'],
            'listo': ['entregado'],
            'entregado': [],
            'cancelado': [],
        }
        estados_permitidos = transiciones_validas.get(pedido.estado, [])
        if nuevo_estado not in estados_permitidos:
            raise ValueError(
                f"No se puede cambiar de '{pedido.estado}' a '{nuevo_estado}'. "
                f"Transiciones permitidas: {estados_permitidos}"
            )
        pedido.estado = nuevo_estado
        pedido.save()
        return pedido

    @staticmethod
    def listar_pedidos_por_cliente(cliente_id: int):
        return Pedido.objects.filter(
            cliente_id=cliente_id
        ).select_related('moto').order_by('-fecha')

    @staticmethod
    def generar_factura(pedido: Pedido) -> dict:
        """Genera una representacion de factura del pedido."""
        return {
            'numero_factura': f"FAC-{pedido.numero_pedido}",
            'fecha': str(pedido.fecha),
            'cliente': {
                'nombre': pedido.cliente.nombre,
                'documento': pedido.cliente.numero_documento,
                'email': pedido.cliente.email,
                'direccion': pedido.cliente.direccion,
                'ciudad': pedido.cliente.ciudad,
                'departamento': pedido.cliente.departamento,
            },
            'moto': {
                'modelo': pedido.moto.modelo,
                'anio': pedido.moto.anio,
                'color': pedido.moto.color,
            },
            'cantidad': pedido.cantidad,
            'precio_unitario': str(pedido.precio_unitario),
            'subtotal': str(pedido.subtotal),
            'iva': str(pedido.iva),
            'total': str(pedido.total),
            'estado': pedido.get_estado_display(),
        }

    @staticmethod
    def listar_pedidos():
        return Pedido.objects.select_related(
            'cliente', 'moto'
        ).all().order_by('-fecha')

    @staticmethod
    def formatear_total(pedido: Pedido) -> str:
        """Formatea el total del pedido al formato colombiano."""
        total_str = f"{int(pedido.total):,}".replace(',', '.')
        return f"${total_str}"
