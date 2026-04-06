from abc import ABC, abstractmethod


class PaymentGateway(ABC):
    """Contracto base para integrar pasarelas de pago."""

    @abstractmethod
    def create_checkout(self, pago) -> dict:
        """Genera URL de checkout y metadatos externos."""

    @abstractmethod
    def normalize_return(self, params: dict) -> dict:
        """Normaliza la respuesta de retorno de la pasarela."""
