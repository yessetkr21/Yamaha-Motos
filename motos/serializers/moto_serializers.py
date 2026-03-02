from rest_framework import serializers
from motos.models import Moto
from motos.services.moto_service import MotoService


class MotoListSerializer(serializers.ModelSerializer):
    """Serializer de lista. Delega logica de negocio al Service Layer."""
    categoria_display = serializers.CharField(
        source='get_categoria_display', read_only=True
    )
    precio_formateado = serializers.SerializerMethodField()
    disponible = serializers.SerializerMethodField()

    class Meta:
        model = Moto
        fields = [
            'id', 'modelo', 'anio', 'categoria', 'categoria_display',
            'precio', 'precio_formateado', 'cilindrada', 'color',
            'stock', 'disponible', 'imagen',
        ]

    def get_disponible(self, obj):
        return MotoService.consultar_disponibilidad(obj)

    def get_precio_formateado(self, obj):
        return MotoService.formatear_precio(obj)


class MotoSerializer(serializers.ModelSerializer):
    """Serializer de detalle. Delega logica de negocio al Service Layer."""
    categoria_display = serializers.CharField(
        source='get_categoria_display', read_only=True
    )
    precio_formateado = serializers.SerializerMethodField()
    disponible = serializers.SerializerMethodField()

    class Meta:
        model = Moto
        fields = [
            'id', 'modelo', 'anio', 'categoria', 'categoria_display',
            'precio', 'precio_formateado', 'cilindrada', 'color',
            'stock', 'disponible', 'imagen', 'created_at', 'updated_at',
        ]

    def get_disponible(self, obj):
        return MotoService.consultar_disponibilidad(obj)

    def get_precio_formateado(self, obj):
        return MotoService.formatear_precio(obj)
