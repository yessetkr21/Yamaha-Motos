from rest_framework import serializers

from motos.models import Pago


class PagoSerializer(serializers.ModelSerializer):
    pedido_numero = serializers.CharField(source='pedido.numero_pedido', read_only=True)
    pedido_estado = serializers.CharField(source='pedido.estado', read_only=True)
    cliente_nombre = serializers.CharField(source='pedido.cliente.nombre', read_only=True)
    moto_modelo = serializers.CharField(source='pedido.moto.modelo', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    gateway_display = serializers.CharField(source='get_gateway_display', read_only=True)

    class Meta:
        model = Pago
        fields = [
            'id', 'pedido', 'pedido_numero', 'pedido_estado',
            'cliente_nombre', 'moto_modelo',
            'gateway', 'gateway_display',
            'estado', 'estado_display',
            'monto', 'moneda',
            'external_reference', 'external_id',
            'checkout_url', 'detalle_estado',
            'paid_at', 'created_at',
        ]


class PagoIniciarSerializer(serializers.Serializer):
    pedido_id = serializers.IntegerField(min_value=1)
    gateway = serializers.ChoiceField(choices=['mercadopago'], default='mercadopago')


class PagoConfirmarRetornoSerializer(serializers.Serializer):
    pago_id = serializers.IntegerField(required=False, min_value=1)
    external_reference = serializers.CharField(required=False)
    status = serializers.CharField(required=False)
    payment_id = serializers.CharField(required=False)
    collection_id = serializers.CharField(required=False)
    preference_id = serializers.CharField(required=False)
    status_detail = serializers.CharField(required=False)
    detail = serializers.CharField(required=False)
    params = serializers.DictField(required=False)

    def validate(self, attrs):
        pago_id = attrs.get('pago_id')
        external_reference = attrs.get('external_reference')
        if not pago_id and not external_reference:
            raise serializers.ValidationError(
                'Se requiere pago_id o external_reference para confirmar retorno.'
            )
        return attrs
