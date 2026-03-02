"""
Management command para eliminar motos sin foto
"""
from django.core.management.base import BaseCommand
from motos.models import Moto


class Command(BaseCommand):
    help = 'Elimina las motos que no tienen foto asignada'

    def handle(self, *args, **options):
        self.stdout.write('[*] Buscando motos sin foto...')

        # Las motos que tienen fotos hardcodeadas en el template
        motos_con_foto = ['NMAX 155', 'MT-09 SP', 'Aerox 155']

        # Encontrar motos que no tienen imagen Y no están en la lista de motos con foto
        motos_sin_foto = Moto.objects.exclude(nombre__in=motos_con_foto).filter(imagen='')

        # También buscar motos con imagen null
        motos_sin_foto_null = Moto.objects.exclude(nombre__in=motos_con_foto).filter(imagen__isnull=True)

        # Combinar ambos querysets
        total_sin_foto = motos_sin_foto.count() + motos_sin_foto_null.count()

        if total_sin_foto == 0:
            self.stdout.write('[OK] No se encontraron motos sin foto para eliminar.')
            return

        self.stdout.write(f'[*] Se encontraron {total_sin_foto} motos sin foto:')

        for moto in motos_sin_foto:
            self.stdout.write(f'  - {moto.nombre} (ID: {moto.id})')

        for moto in motos_sin_foto_null:
            self.stdout.write(f'  - {moto.nombre} (ID: {moto.id})')

        # Eliminar
        deleted_count = 0
        for moto in motos_sin_foto:
            moto.delete()
            deleted_count += 1

        for moto in motos_sin_foto_null:
            moto.delete()
            deleted_count += 1

        self.stdout.write(f'[OK] Se eliminaron {deleted_count} motos sin foto.')
        self.stdout.write('')
        self.stdout.write('Motos restantes en el catalogo:')

        for moto in Moto.objects.all():
            self.stdout.write(f'  - {moto.nombre}')
