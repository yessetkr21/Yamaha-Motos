from motos.factories.notificacion_factory import NotificacionFactory


class NotificacionService:
    """Orquesta el envio de notificaciones usando el patron Factory."""

    @staticmethod
    def notificar_pedido_creado(pedido):
        notificador = NotificacionFactory.crear('email')
        mensaje = (
            f"Su pedido {pedido.numero_pedido} ha sido creado exitosamente. "
            f"Total: ${pedido.total}"
        )
        return notificador.enviar(
            destinatario=pedido.cliente.email,
            asunto=f'Pedido {pedido.numero_pedido} - Confirmacion',
            mensaje=mensaje,
        )

    @staticmethod
    def notificar_cambio_estado(pedido):
        notificador = NotificacionFactory.crear('email')
        mensaje = (
            f"Su pedido {pedido.numero_pedido} ha cambiado al estado: "
            f"{pedido.get_estado_display()}"
        )
        return notificador.enviar(
            destinatario=pedido.cliente.email,
            asunto=f'Pedido {pedido.numero_pedido} - Actualizacion',
            mensaje=mensaje,
        )

    @staticmethod
    def notificar_cita_agendada(cita):
        notificador = NotificacionFactory.crear('email')
        mensaje = (
            f"Su cita para ver la {cita.moto.modelo} ha sido agendada "
            f"para el {cita.fecha} a las {cita.hora}."
        )
        return notificador.enviar(
            destinatario=cita.cliente.email,
            asunto='Cita Agendada - Yamaha Colombia',
            mensaje=mensaje,
        )

    @staticmethod
    def enviar_recordatorio_cita(cita):
        notificador = NotificacionFactory.crear('whatsapp')
        mensaje = (
            f"Recordatorio: tiene una cita manana {cita.fecha} a las {cita.hora} "
            f"para ver la {cita.moto.modelo}."
        )
        return notificador.enviar(
            destinatario=cita.cliente.telefono,
            asunto='Recordatorio de Cita',
            mensaje=mensaje,
        )

