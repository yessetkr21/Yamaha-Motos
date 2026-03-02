from django.db.models import QuerySet
from motos.models import Cliente


class ClienteService:
    """Servicio para operaciones relacionadas con clientes (SRP)."""

    @staticmethod
    def iniciar_sesion(email: str, numero_documento: str) -> Cliente:
        """Autentica un cliente por email y numero de documento."""
        try:
            cliente = Cliente.objects.get(email=email, numero_documento=numero_documento)
            return cliente
        except Cliente.DoesNotExist:
            return None

    @staticmethod
    def crear_cliente(data: dict) -> Cliente:
        cliente = Cliente(**data)
        cliente.full_clean()
        cliente.save()
        return cliente

    @staticmethod
    def obtener_cliente_por_pk(pk: int):
        try:
            return Cliente.objects.get(pk=pk)
        except Cliente.DoesNotExist:
            return None

    @staticmethod
    def obtener_cliente_por_documento(numero_documento: str):
        try:
            return Cliente.objects.get(numero_documento=numero_documento)
        except Cliente.DoesNotExist:
            return None

    @staticmethod
    def obtener_o_crear_cliente(data: dict) -> Cliente:
        """Busca un cliente por documento; si no existe, lo crea."""
        cliente = ClienteService.obtener_cliente_por_documento(
            data.get('numero_documento', '')
        )
        if cliente is not None:
            return cliente
        return ClienteService.crear_cliente(data)

    @staticmethod
    def listar_clientes() -> QuerySet:
        return Cliente.objects.all()

    @staticmethod
    def actualizar_cliente(cliente: Cliente, data: dict) -> Cliente:
        for key, value in data.items():
            setattr(cliente, key, value)
        cliente.full_clean()
        cliente.save()
        return cliente
