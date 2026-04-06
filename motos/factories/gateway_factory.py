from motos.gateways import MercadoPagoGateway, PaymentGateway


class GatewayFactory:
    """Factory/Registry para gateways de pago (OCP)."""

    _gateways = {
        'mercadopago': MercadoPagoGateway,
    }

    @classmethod
    def crear(cls, gateway: str) -> PaymentGateway:
        gateway_class = cls._gateways.get(gateway)
        if gateway_class is None:
            raise ValueError(
                f"Gateway no soportado: '{gateway}'. "
                f"Disponibles: {list(cls._gateways.keys())}"
            )
        return gateway_class()

    @classmethod
    def registrar(cls, nombre: str, gateway_class: type):
        if not issubclass(gateway_class, PaymentGateway):
            raise TypeError('El gateway debe heredar de PaymentGateway')
        cls._gateways[nombre] = gateway_class

    @classmethod
    def disponibles(cls) -> list:
        return list(cls._gateways.keys())
