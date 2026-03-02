from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError

from motos.services import ClienteService
from motos.serializers import ClienteSerializer, ClienteCreateSerializer


class ClienteLoginAPIView(APIView):
    """POST /api/v1/clientes/login/ - Iniciar sesion de cliente."""

    def post(self, request):
        email = request.data.get('email')
        numero_documento = request.data.get('numero_documento')
        if not email or not numero_documento:
            return Response(
                {'error': 'Se requiere email y numero_documento.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        cliente = ClienteService.iniciar_sesion(email, numero_documento)
        if cliente is None:
            return Response(
                {'error': 'Credenciales invalidas.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ClienteSerializer(cliente)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ClienteListCreateAPIView(APIView):
    """
    GET  /api/v1/clientes/     - Listar clientes
    POST /api/v1/clientes/     - Crear un cliente
    """

    def get(self, request):
        clientes = ClienteService.listar_clientes()
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        input_serializer = ClienteCreateSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response(
                input_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cliente = ClienteService.crear_cliente(input_serializer.validated_data)
        except ValidationError as e:
            error_str = str(e).lower()
            if 'unique' in error_str or 'ya existe' in error_str:
                return Response(
                    {'error': 'Ya existe un cliente con ese documento o email.'},
                    status=status.HTTP_409_CONFLICT
                )
            return Response(
                {'error': e.message_dict}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            if 'unique' in str(e).lower():
                return Response(
                    {'error': 'Ya existe un cliente con ese documento o email.'},
                    status=status.HTTP_409_CONFLICT
                )
            raise

        output_serializer = ClienteSerializer(cliente)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)


class ClienteDetailAPIView(APIView):
    """
    GET /api/v1/clientes/<pk>/ - Obtener un cliente
    PUT /api/v1/clientes/<pk>/ - Actualizar un cliente
    """

    def get(self, request, pk):
        cliente = ClienteService.obtener_cliente_por_pk(pk)
        if cliente is None:
            return Response(
                {'error': 'Cliente no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ClienteSerializer(cliente)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        cliente = ClienteService.obtener_cliente_por_pk(pk)
        if cliente is None:
            return Response(
                {'error': 'Cliente no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        input_serializer = ClienteCreateSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response(
                input_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cliente = ClienteService.actualizar_cliente(
                cliente, input_serializer.validated_data
            )
        except ValidationError as e:
            return Response(
                {'error': e.message_dict}, status=status.HTTP_400_BAD_REQUEST
            )

        output_serializer = ClienteSerializer(cliente)
        return Response(output_serializer.data, status=status.HTTP_200_OK)
