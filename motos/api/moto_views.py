from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from motos.services import MotoService
from motos.serializers import MotoSerializer, MotoListSerializer


class MotoListAPIView(APIView):
    """GET /api/v1/motos/ - Listar motos con filtros opcionales."""

    def get(self, request):
        categoria = request.query_params.get('categoria')
        q = request.query_params.get('q')

        if q:
            motos = MotoService.buscar_motos(q)
        elif categoria:
            motos = MotoService.obtener_motos_por_categoria(categoria)
        else:
            motos = MotoService.obtener_motos_disponibles()

        serializer = MotoListSerializer(motos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MotoDetailAPIView(APIView):
    """GET /api/v1/motos/<pk>/ - Obtener detalle de una moto."""

    def get(self, request, pk):
        moto = MotoService.obtener_moto_por_pk(pk)
        if moto is None:
            return Response(
                {'error': 'Moto no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = MotoSerializer(moto)
        return Response(serializer.data, status=status.HTTP_200_OK)
