import uuid
from decimal import Decimal
from motos.models import Pedido, Moto

TASA_IVA = Decimal('0.19')  # IVA Colombia 19%


class PedidoBuilder:
    """
    Builder pattern para construir objetos Pedido.
    El Pedido es la entidad mas compleja del sistema: incluye cliente, moto,
    cantidad, calculos financieros (subtotal, IVA, total) y gestion de estados.
    """

    def __init__(self):
        self._cliente = None
        self._moto = None
        self._cantidad = 1
        self._subtotal = Decimal('0')
        self._iva = Decimal('0')
        self._total = Decimal('0')

    def set_cliente(self, cliente):
        self._cliente = cliente
        return self

    def set_moto(self, moto: Moto):
        if moto.stock < 1:
            raise ValueError(f"La moto '{moto.modelo}' no tiene stock disponible.")
        self._moto = moto
        return self

    def set_cantidad(self, cantidad: int):
        if cantidad < 1:
            raise ValueError("La cantidad debe ser al menos 1.")
        if self._moto and cantidad > self._moto.stock:
            raise ValueError(
                f"Stock insuficiente. Disponible: {self._moto.stock}, "
                f"solicitado: {cantidad}"
            )
        self._cantidad = cantidad
        return self

    def calcular_totales(self):
        """Calcula subtotal y total. El precio ya incluye IVA, no se suma de nuevo."""
        if self._moto is None:
            raise ValueError("Debe asignar una moto antes de calcular totales.")
        precio_unitario = self._moto.precio
        self._subtotal = (precio_unitario * self._cantidad).quantize(Decimal('0.01'))
        # IVA ya incluido en el precio — se registra como referencia pero no se suma al total
        self._iva = (self._subtotal - self._subtotal / (1 + TASA_IVA)).quantize(Decimal('0.01'))
        self._total = self._subtotal
        return self

    def build(self) -> Pedido:
        """Construye y persiste el Pedido."""
        if self._cliente is None:
            raise ValueError("El pedido requiere un cliente.")
        if self._moto is None:
            raise ValueError("El pedido requiere una moto.")
        if self._total == 0:
            self.calcular_totales()

        pedido = Pedido(
            numero_pedido=f"PED-{uuid.uuid4().hex[:8].upper()}",
            cliente=self._cliente,
            moto=self._moto,
            cantidad=self._cantidad,
            precio_unitario=self._moto.precio,
            subtotal=self._subtotal,
            iva=self._iva,
            total=self._total,
        )
        pedido.full_clean()
        pedido.save()

        # Descontar stock
        self._moto.stock -= self._cantidad
        self._moto.save()

        return pedido
