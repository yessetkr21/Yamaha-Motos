from typing import Optional
from django.db.models import QuerySet
from motos.models import Moto


class MotoService:
    """Servicio para operaciones relacionadas con motos (SRP)."""

    @staticmethod
    def obtener_motos_disponibles() -> QuerySet[Moto]:
        return Moto.objects.filter(stock__gt=0)

    @staticmethod
    def obtener_motos_por_categoria(categoria: str) -> QuerySet[Moto]:
        return Moto.objects.filter(categoria=categoria, stock__gt=0)

    @staticmethod
    def obtener_categorias():
        return Moto.CATEGORIAS

    @staticmethod
    def buscar_motos(query: str) -> QuerySet[Moto]:
        return Moto.objects.filter(modelo__icontains=query, stock__gt=0)

    @staticmethod
    def obtener_moto_por_pk(pk: int) -> Optional[Moto]:
        try:
            return Moto.objects.get(pk=pk)
        except Moto.DoesNotExist:
            return None

    @staticmethod
    def consultar_disponibilidad(moto: Moto) -> bool:
        """Retorna True si la moto tiene stock disponible."""
        return moto.stock > 0

    @staticmethod
    def formatear_precio(moto: Moto) -> str:
        """Formatea el precio de la moto al formato colombiano."""
        precio_str = f"{int(moto.precio):,}".replace(',', '.')
        return f"${precio_str}"

    @staticmethod
    def validar_disponibilidad_compra(moto: Moto, cantidad: int = 1):
        """Valida que la moto tenga stock suficiente para la compra."""
        if moto.stock < 1:
            raise ValueError(f"La moto '{moto.modelo}' no tiene stock disponible.")
        if cantidad > moto.stock:
            raise ValueError(
                f"Stock insuficiente para '{moto.modelo}'. "
                f"Disponible: {moto.stock}, solicitado: {cantidad}"
            )

    @staticmethod
    def actualizar_stock(moto: Moto, cantidad: int) -> Moto:
        moto.stock = cantidad
        moto.full_clean()
        moto.save()
        return moto

    @staticmethod
    def obtener_todas() -> QuerySet[Moto]:
        return Moto.objects.all()
