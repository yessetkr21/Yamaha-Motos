from django.contrib import admin
from .models import Moto, Cliente, Pedido, Cita


@admin.register(Moto)
class MotoAdmin(admin.ModelAdmin):
    list_display = ['id', 'modelo', 'anio', 'categoria', 'color', 'precio', 'stock']
    list_filter = ['categoria', 'anio']
    search_fields = ['modelo', 'color']


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'numero_documento', 'email', 'ciudad']
    search_fields = ['nombre', 'numero_documento', 'email']
    list_filter = ['departamento']


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ['numero_pedido', 'cliente', 'moto', 'estado', 'cantidad', 'total', 'fecha']
    list_filter = ['estado']
    search_fields = ['numero_pedido']


@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    list_display = ['id', 'cliente', 'moto', 'fecha', 'hora', 'estado', 'canal_contacto']
    list_filter = ['estado', 'canal_contacto']
