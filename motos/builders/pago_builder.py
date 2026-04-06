import uuid

from motos.models import Pago, Pedido


class PagoBuilder:
    """Builder para crear/reusar pagos ligados a un pedido."""

    def __init__(self):
        self._pedido = None
        self._gateway = 'mercadopago'

    def set_pedido(self, pedido: Pedido):
        self._pedido = pedido
        return self

    def set_gateway(self, gateway: str):
        self._gateway = gateway
        return self

    def build(self):
        if self._pedido is None:
            raise ValueError('El pago requiere un pedido.')

        defaults = {
            'gateway': self._gateway,
            'estado': 'creado',
            'monto': self._pedido.total,
            'moneda': 'COP',
            'external_reference': self._generate_reference(self._pedido),
        }

        pago, created = Pago.objects.get_or_create(
            pedido=self._pedido,
            defaults=defaults,
        )

        if not created:
            pago.gateway = self._gateway
            pago.monto = self._pedido.total
            if not pago.external_reference:
                pago.external_reference = self._generate_reference(self._pedido)
            pago.save(update_fields=['gateway', 'monto', 'external_reference', 'updated_at'])

        return pago, created

    @staticmethod
    def _generate_reference(pedido: Pedido) -> str:
        return f"PAY-{pedido.numero_pedido}-{uuid.uuid4().hex[:6].upper()}"
