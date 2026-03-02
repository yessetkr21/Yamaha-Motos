from abc import ABC, abstractmethod
import logging

logger = logging.getLogger(__name__)


class Notificador(ABC):
    """Clase base abstracta para canales de notificacion."""

    @abstractmethod
    def enviar(self, destinatario: str, asunto: str, mensaje: str) -> dict:
        pass


class EmailNotificador(Notificador):
    """Envia notificaciones por email (simulado)."""

    def enviar(self, destinatario: str, asunto: str, mensaje: str) -> dict:
        logger.info(f"[EMAIL] Para: {destinatario} | Asunto: {asunto}")
        return {
            'canal': 'email',
            'destinatario': destinatario,
            'asunto': asunto,
            'estado': 'enviado',
        }


class SMSNotificador(Notificador):
    """Envia notificaciones por SMS (simulado)."""

    def enviar(self, destinatario: str, asunto: str, mensaje: str) -> dict:
        logger.info(f"[SMS] Para: {destinatario} | Mensaje: {mensaje[:50]}...")
        return {
            'canal': 'sms',
            'destinatario': destinatario,
            'estado': 'enviado',
        }


class WhatsAppNotificador(Notificador):
    """Envia notificaciones por WhatsApp (simulado)."""

    def enviar(self, destinatario: str, asunto: str, mensaje: str) -> dict:
        logger.info(f"[WHATSAPP] Para: {destinatario} | Mensaje: {mensaje[:50]}...")
        return {
            'canal': 'whatsapp',
            'destinatario': destinatario,
            'estado': 'enviado',
        }


class NotificacionFactory:
    """
    Factory pattern: crea el notificador apropiado segun el tipo de canal.
    Desacopla la logica de notificacion de las implementaciones especificas.
    Nuevos canales pueden agregarse sin modificar codigo existente (OCP).
    """

    _notificadores = {
        'email': EmailNotificador,
        'sms': SMSNotificador,
        'whatsapp': WhatsAppNotificador,
    }

    @classmethod
    def crear(cls, canal: str) -> Notificador:
        notificador_class = cls._notificadores.get(canal)
        if notificador_class is None:
            raise ValueError(
                f"Canal de notificacion no soportado: '{canal}'. "
                f"Opciones: {list(cls._notificadores.keys())}"
            )
        return notificador_class()

    @classmethod
    def registrar_canal(cls, nombre: str, notificador_class: type):
        """Permite registrar nuevos canales en tiempo de ejecucion (OCP)."""
        if not issubclass(notificador_class, Notificador):
            raise TypeError("El notificador debe heredar de Notificador")
        cls._notificadores[nombre] = notificador_class
