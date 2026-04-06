from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from motos.serializers import (
    PagoConfirmarRetornoSerializer,
    PagoIniciarSerializer,
    PagoSerializer,
)
from motos.services import PagoService, PedidoService


class PagoListAPIView(APIView):
    """GET /api/v1/pagos/ - Listar pagos (filtro por cliente o pedido)."""

    def get(self, request):
        cliente_id = request.query_params.get('cliente_id')
        pedido_id = request.query_params.get('pedido_id')

        try:
            cliente_id = int(cliente_id) if cliente_id else None
            pedido_id = int(pedido_id) if pedido_id else None
        except ValueError:
            return Response(
                {'error': 'cliente_id y pedido_id deben ser numericos.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        pagos = PagoService.listar_pagos(cliente_id=cliente_id, pedido_id=pedido_id)
        serializer = PagoSerializer(pagos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PagoDetailAPIView(APIView):
    """GET /api/v1/pagos/<pk>/ - Obtener detalle de un pago."""

    def get(self, request, pk):
        pago = PagoService.obtener_pago_por_pk(pk)
        if pago is None:
            return Response(
                {'error': 'Pago no encontrado'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PagoSerializer(pago)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PagoIniciarAPIView(APIView):
    """POST /api/v1/pagos/iniciar/ - Crear pago y obtener URL de checkout."""

    def post(self, request):
        input_serializer = PagoIniciarSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response(
                input_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = input_serializer.validated_data
        pedido = PedidoService.obtener_pedido_por_pk(data['pedido_id'])
        if pedido is None:
            return Response(
                {'error': 'Pedido no encontrado'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if pedido.estado == 'cancelado':
            return Response(
                {'error': 'No es posible pagar un pedido cancelado.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            pago, created = PagoService.iniciar_pago(
                pedido=pedido,
                gateway=data.get('gateway', 'mercadopago'),
            )
        except ValueError as exc:
            return Response(
                {'error': str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        output_serializer = PagoSerializer(pago)
        http_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(output_serializer.data, status=http_status)


class PagoConfirmarRetornoAPIView(APIView):
    """POST /api/v1/pagos/confirmar-retorno/ - Confirmar estado tras redireccion."""

    def post(self, request):
        input_serializer = PagoConfirmarRetornoSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response(
                input_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = input_serializer.validated_data
        pago = None

        if data.get('pago_id'):
            pago = PagoService.obtener_pago_por_pk(data['pago_id'])
        elif data.get('external_reference'):
            pago = PagoService.obtener_pago_por_external_reference(
                data['external_reference']
            )

        if pago is None:
            return Response(
                {'error': 'Pago no encontrado'},
                status=status.HTTP_404_NOT_FOUND,
            )

        params = dict(data.get('params') or {})
        for key in (
            'status',
            'payment_id',
            'collection_id',
            'preference_id',
            'status_detail',
            'detail',
            'external_reference',
        ):
            if key in data and data[key] not in (None, ''):
                params.setdefault(key, data[key])

        params.setdefault('external_reference', pago.external_reference)

        try:
            pago = PagoService.confirmar_retorno(pago, params)
        except ValueError as exc:
            return Response(
                {'error': str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = PagoSerializer(pago)
        return Response(serializer.data, status=status.HTTP_200_OK)
