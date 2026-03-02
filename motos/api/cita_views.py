from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from motos.services import ClienteService, MotoService, CitaService, NotificacionService
from motos.serializers import CitaSerializer, CitaCreateSerializer


class CitaListCreateAPIView(APIView):
    """
    GET  /api/v1/citas/     - Listar citas
    POST /api/v1/citas/     - Agendar una cita
    """

    def get(self, request):
        cliente_id = request.query_params.get('cliente_id')
        if cliente_id:
            citas = CitaService.listar_citas_por_cliente(int(cliente_id))
        else:
            citas = CitaService.listar_citas()
        serializer = CitaSerializer(citas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        input_serializer = CitaCreateSerializer(data=request.data)
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
            cita = CitaService.agendar_cita(
                cliente=cliente,
                moto=moto,
                fecha=data['fecha'],
                hora=data['hora'],
                canal_contacto=data.get('canal_contacto', 'whatsapp'),
                mensaje=data.get('mensaje', ''),
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_400_BAD_REQUEST
            )

        NotificacionService.notificar_cita_agendada(cita)
        output = CitaSerializer(cita)
        return Response(output.data, status=status.HTTP_201_CREATED)


class CitaDetailAPIView(APIView):
    """GET /api/v1/citas/<pk>/ - Obtener detalle de una cita."""

    def get(self, request, pk):
        cita = CitaService.obtener_cita_por_pk(pk)
        if cita is None:
            return Response(
                {'error': 'Cita no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = CitaSerializer(cita)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CitaConfirmarAPIView(APIView):
    """PATCH /api/v1/citas/<pk>/confirmar/ - Confirmar una cita."""

    def patch(self, request, pk):
        cita = CitaService.obtener_cita_por_pk(pk)
        if cita is None:
            return Response(
                {'error': 'Cita no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        try:
            cita = CitaService.confirmar_cita(cita)
        except ValueError as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        output = CitaSerializer(cita)
        return Response(output.data, status=status.HTTP_200_OK)


class CitaCancelarAPIView(APIView):
    """PATCH /api/v1/citas/<pk>/cancelar/ - Cancelar una cita."""

    def patch(self, request, pk):
        cita = CitaService.obtener_cita_por_pk(pk)
        if cita is None:
            return Response(
                {'error': 'Cita no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        try:
            cita = CitaService.cancelar_cita(cita)
        except ValueError as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        output = CitaSerializer(cita)
        return Response(output.data, status=status.HTTP_200_OK)
