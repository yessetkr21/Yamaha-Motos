from django.utils import timezone

from motos.builders.pago_builder import PagoBuilder
from motos.factories.gateway_factory import GatewayFactory
from motos.models import Pago, Pedido
from motos.services.pedido_service import PedidoService


class PagoService:
    """Servicio de orquestacion del ciclo de pagos."""

    TRANSICIONES_VALIDAS = {
        'creado': ['pendiente', 'rechazado', 'cancelado'],
        'pendiente': ['pendiente', 'aprobado', 'rechazado', 'cancelado'],
        'rechazado': ['pendiente', 'rechazado', 'cancelado'],
        'cancelado': ['pendiente', 'cancelado'],
        'aprobado': ['aprobado'],
    }

    @staticmethod
    def iniciar_pago(pedido: Pedido, gateway: str = 'mercadopago'):
        pago, created = (
            PagoBuilder()
            .set_pedido(pedido)
            .set_gateway(gateway)
            .build()
        )

        if pago.estado == 'aprobado':
            return pago, created

        gateway_client = GatewayFactory.crear(gateway)
        checkout_data = gateway_client.create_checkout(pago)

        pago.gateway = gateway
        pago.estado = 'pendiente'
        pago.checkout_url = checkout_data.get('checkout_url', '')
        pago.external_id = checkout_data.get('external_id') or pago.external_id
        pago.external_reference = (
            checkout_data.get('external_reference') or pago.external_reference
        )
        pago.metadata = {
            **(pago.metadata or {}),
            **(checkout_data.get('metadata') or {}),
        }
        pago.detalle_estado = ''
        pago.save()
        return pago, created

    @staticmethod
    def confirmar_retorno(pago: Pago, return_params: dict) -> Pago:
        gateway_client = GatewayFactory.crear(pago.gateway)
        normalized = gateway_client.normalize_return(return_params)

        nuevo_estado = normalized['estado']
        if not PagoService._transicion_valida(pago.estado, nuevo_estado):
            raise ValueError(
                f"Transicion invalida de pago: {pago.estado} -> {nuevo_estado}"
            )

        pago.estado = nuevo_estado
        if normalized.get('external_id'):
            pago.external_id = normalized['external_id']
        if normalized.get('detalle_estado'):
            pago.detalle_estado = normalized['detalle_estado']

        pago.metadata = {
            **(pago.metadata or {}),
            **(normalized.get('metadata') or {}),
        }

        if nuevo_estado == 'aprobado':
            if pago.pedido.estado == 'pendiente':
                PedidoService.actualizar_estado(pago.pedido, 'confirmado')
            if pago.paid_at is None:
                pago.paid_at = timezone.now()

        pago.save()
        return pago

    @staticmethod
    def obtener_pago_por_pk(pk: int):
        try:
            return Pago.objects.select_related(
                'pedido', 'pedido__cliente', 'pedido__moto'
            ).get(pk=pk)
        except Pago.DoesNotExist:
            return None

    @staticmethod
    def obtener_pago_por_external_reference(external_reference: str):
        try:
            return Pago.objects.select_related(
                'pedido', 'pedido__cliente', 'pedido__moto'
            ).get(external_reference=external_reference)
        except Pago.DoesNotExist:
            return None

    @staticmethod
    def listar_pagos(cliente_id: int = None, pedido_id: int = None):
        pagos = Pago.objects.select_related(
            'pedido', 'pedido__cliente', 'pedido__moto'
        )
        if cliente_id is not None:
            pagos = pagos.filter(pedido__cliente_id=cliente_id)
        if pedido_id is not None:
            pagos = pagos.filter(pedido_id=pedido_id)
        return pagos.order_by('-created_at')

    @staticmethod
    def _transicion_valida(estado_actual: str, nuevo_estado: str) -> bool:
        permitidos = PagoService.TRANSICIONES_VALIDAS.get(estado_actual, [])
        return nuevo_estado in permitidos
