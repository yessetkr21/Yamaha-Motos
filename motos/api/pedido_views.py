from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from motos.services import ClienteService, MotoService, PedidoService, NotificacionService
from motos.serializers import (
    PedidoSerializer, PedidoCreateSerializer, PedidoCambiarEstadoSerializer,
)


class PedidoListCreateAPIView(APIView):
    """
    GET  /api/v1/pedidos/     - Listar pedidos
    POST /api/v1/pedidos/     - Crear un pedido (usa Builder)
    """

    def get(self, request):
        cliente_id = request.query_params.get('cliente_id')
        if cliente_id:
            pedidos = PedidoService.listar_pedidos_por_cliente(int(cliente_id))
        else:
            pedidos = PedidoService.listar_pedidos()
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        input_serializer = PedidoCreateSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response(
                input_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        data = input_serializer.validated_data
        cliente = ClienteService.obtener_cliente_por_pk(data['cliente_id'])
        if cliente is None:
            return Response(
                {'error': 'Cliente no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        moto = MotoService.obtener_moto_por_pk(data['moto_id'])
        if moto is None:
            return Response(
                {'error': 'Moto no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            pedido = PedidoService.crear_pedido(
                cliente=cliente,
                moto=moto,
                cantidad=data.get('cantidad', 1),
            )
        except ValueError as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_400_BAD_REQUEST
            )

        NotificacionService.notificar_pedido_creado(pedido)
        output = PedidoSerializer(pedido)
        return Response(output.data, status=status.HTTP_201_CREATED)


class PedidoDetailAPIView(APIView):
    """GET /api/v1/pedidos/<pk>/ - Obtener detalle de un pedido."""

    def get(self, request, pk):
        pedido = PedidoService.obtener_pedido_por_pk(pk)
        if pedido is None:
            return Response(
                {'error': 'Pedido no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = PedidoSerializer(pedido)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PedidoCambiarEstadoAPIView(APIView):
    """PATCH /api/v1/pedidos/<pk>/estado/ - Cambiar estado de un pedido."""

    def patch(self, request, pk):
        pedido = PedidoService.obtener_pedido_por_pk(pk)
        if pedido is None:
            return Response(
                {'error': 'Pedido no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        input_serializer = PedidoCambiarEstadoSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response(
                input_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            pedido = PedidoService.actualizar_estado(
                pedido, input_serializer.validated_data['estado']
            )
        except ValueError as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_400_BAD_REQUEST
            )

        NotificacionService.notificar_cambio_estado(pedido)
        output = PedidoSerializer(pedido)
        return Response(output.data, status=status.HTTP_200_OK)


class PedidoFacturaAPIView(APIView):
    """GET /api/v1/pedidos/<pk>/factura/ - Generar factura de un pedido."""

    def get(self, request, pk):
        pedido = PedidoService.obtener_pedido_por_pk(pk)
        if pedido is None:
            return Response(
                {'error': 'Pedido no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        factura = PedidoService.generar_factura(pedido)
        return Response(factura, status=status.HTTP_200_OK)
