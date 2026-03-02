from datetime import date, timedelta
from motos.models import Cita, Cliente, Moto


class CitaService:
    """Servicio para operaciones relacionadas con citas (SRP)."""

    DIAS_MINIMO_ANTICIPACION = 1
    DIAS_MAXIMO_ANTICIPACION = 60

    @staticmethod
    def obtener_rango_fechas_disponibles() -> dict:
        """Retorna el rango de fechas validas para agendar una cita."""
        fecha_min = date.today() + timedelta(days=CitaService.DIAS_MINIMO_ANTICIPACION)
        fecha_max = date.today() + timedelta(days=CitaService.DIAS_MAXIMO_ANTICIPACION)
        return {
            'fecha_min': fecha_min.isoformat(),
            'fecha_max': fecha_max.isoformat(),
        }

    @staticmethod
    def agendar_cita(cliente: Cliente, moto: Moto, fecha, hora: str,
                     canal_contacto: str = 'whatsapp',
                     mensaje: str = '') -> Cita:
        cita = Cita(
            cliente=cliente,
            moto=moto,
            fecha=fecha,
            hora=hora,
            canal_contacto=canal_contacto,
            mensaje=mensaje,
            estado='pendiente',
        )
        cita.full_clean()
        cita.save()
        return cita

    @staticmethod
    def obtener_cita_por_pk(pk: int):
        try:
            return Cita.objects.select_related('cliente', 'moto').get(pk=pk)
        except Cita.DoesNotExist:
            return None

    @staticmethod
    def confirmar_cita(cita: Cita) -> Cita:
        if cita.estado != 'pendiente':
            raise ValueError("Solo se pueden confirmar citas pendientes.")
        cita.estado = 'confirmada'
        cita.save()
        return cita

    @staticmethod
    def cancelar_cita(cita: Cita) -> Cita:
        if cita.estado in ('cancelada', 'completada'):
            raise ValueError(f"No se puede cancelar una cita {cita.estado}.")
        cita.estado = 'cancelada'
        cita.save()
        return cita

    @staticmethod
    def listar_citas_por_cliente(cliente_id: int):
        return Cita.objects.filter(
            cliente_id=cliente_id
        ).select_related('moto').order_by('-fecha', '-hora')

    @staticmethod
    def listar_citas():
        return Cita.objects.select_related(
            'cliente', 'moto'
        ).all().order_by('-fecha', '-hora')
