from rest_framework import serializers
from motos.models import Cliente


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = [
            'id', 'nombre', 'email', 'telefono', 'numero_documento',
            'ciudad', 'direccion', 'departamento', 'created_at',
        ]


class ClienteCreateSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    telefono = serializers.CharField(max_length=15)
    numero_documento = serializers.CharField(max_length=20)
    ciudad = serializers.CharField(max_length=100, required=False, default='')
    direccion = serializers.CharField(required=False, default='')
    departamento = serializers.CharField(max_length=100, required=False, default='')
