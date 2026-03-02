from rest_framework import serializers
from motos.models import Cita


class CitaSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.SerializerMethodField()
    moto_modelo = serializers.CharField(source='moto.modelo', read_only=True)
    estado_display = serializers.CharField(
        source='get_estado_display', read_only=True
    )
    canal_display = serializers.CharField(
        source='get_canal_contacto_display', read_only=True
    )

    class Meta:
        model = Cita
        fields = [
            'id', 'cliente', 'cliente_nombre', 'moto', 'moto_modelo',
            'fecha', 'hora', 'estado', 'estado_display',
            'canal_contacto', 'canal_display', 'mensaje',
        ]

    def get_cliente_nombre(self, obj):
        return str(obj.cliente)


class CitaCreateSerializer(serializers.Serializer):
    cliente_id = serializers.IntegerField()
    moto_id = serializers.IntegerField()
    fecha = serializers.DateField()
    hora = serializers.CharField(max_length=10)
    canal_contacto = serializers.ChoiceField(
        choices=['whatsapp', 'telefono', 'email', 'presencial'],
        default='whatsapp'
    )
    mensaje = serializers.CharField(required=False, default='')
