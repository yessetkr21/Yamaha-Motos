from rest_framework import serializers
from motos.models import Pedido


class PedidoSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.SerializerMethodField()
    moto_modelo = serializers.CharField(source='moto.modelo', read_only=True)
    estado_display = serializers.CharField(
        source='get_estado_display', read_only=True
    )

    class Meta:
        model = Pedido
        fields = [
            'id', 'numero_pedido', 'cliente', 'cliente_nombre',
            'moto', 'moto_modelo', 'fecha', 'estado', 'estado_display',
            'cantidad', 'precio_unitario', 'subtotal', 'iva', 'total',
            'created_at',
        ]

    def get_cliente_nombre(self, obj):
        return str(obj.cliente)


class PedidoCreateSerializer(serializers.Serializer):
    cliente_id = serializers.IntegerField()
    moto_id = serializers.IntegerField()
    cantidad = serializers.IntegerField(min_value=1, default=1)


class PedidoCambiarEstadoSerializer(serializers.Serializer):
    estado = serializers.ChoiceField(
        choices=['confirmado', 'en_preparacion', 'listo', 'entregado', 'cancelado']
    )
