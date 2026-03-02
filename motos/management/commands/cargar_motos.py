"""
Management command para cargar las motos al catalogo
"""
from django.core.management.base import BaseCommand
from motos.models import Moto
import os


class Command(BaseCommand):
    help = 'Carga las motos del catalogo Yamaha Colombia'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Iniciando carga de motos...'))

        motos_data = [
            {
                'modelo': 'NMAX 155',
                'anio': 2026,
                'categoria': 'scooter',
                'precio': 16800000.00,
                'cilindrada': 155,
                'color': 'Negro',
                'stock': 5,
                'imagen_path': 'static/images/motos/nmax/negra.avif',
            },
            {
                'modelo': 'MT-09 SP',
                'anio': 2026,
                'categoria': 'naked',
                'precio': 72000000.00,
                'cilindrada': 890,
                'color': 'Gris',
                'stock': 3,
                'imagen_path': 'static/images/motos/mt09/GRIS.avif',
            },
            {
                'modelo': 'Aerox 155',
                'anio': 2026,
                'categoria': 'scooter',
                'precio': 12700000.00,
                'cilindrada': 155,
                'color': 'Negro',
                'stock': 8,
                'imagen_path': 'static/images/motos/aerox155/NEGRA.avif',
            },
            {
                'modelo': 'YCZ 110',
                'anio': 2026,
                'categoria': 'scooter',
                'precio': 6500000.00,
                'cilindrada': 110,
                'color': 'Azul Oscuro',
                'stock': 10,
                'imagen_path': 'static/images/motos/ycz110/azul-oscuro.avif',
            },
            {
                'modelo': 'YZF-R7',
                'anio': 2026,
                'categoria': 'sport',
                'precio': 58000000.00,
                'cilindrada': 689,
                'color': 'Azul Racing',
                'stock': 4,
                'imagen_path': 'static/images/motos/r7/azulr7.avif',
            },
            {
                'modelo': 'MT-07',
                'anio': 2026,
                'categoria': 'naked',
                'precio': 50000000.00,
                'cilindrada': 689,
                'color': 'Azul',
                'stock': 6,
                'imagen_path': 'static/images/motos/mt07/azulmt07}.avif',
            },
        ]

        for moto_data in motos_data:
            modelo = moto_data['modelo']
            imagen_path = moto_data.pop('imagen_path')

            moto, created = Moto.objects.update_or_create(
                modelo=modelo,
                anio=moto_data['anio'],
                defaults={
                    'categoria': moto_data['categoria'],
                    'precio': moto_data['precio'],
                    'cilindrada': moto_data['cilindrada'],
                    'color': moto_data['color'],
                    'stock': moto_data['stock'],
                }
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'[OK] Moto "{modelo}" creada exitosamente')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'[WARN] Moto "{modelo}" ya existia, datos actualizados')
                )

            if os.path.exists(imagen_path):
                self.stdout.write(f'  [*] Imagen encontrada: {imagen_path}')
            else:
                self.stdout.write(
                    self.style.WARNING(f'  [WARN] Imagen no encontrada: {imagen_path}')
                )

        self.stdout.write(
            self.style.SUCCESS('\n[OK] Carga de motos completada!\n')
        )
        self.stdout.write('Puedes verificar las motos en:')
        self.stdout.write('  - Admin: http://localhost:8000/admin/motos/moto/')
        self.stdout.write('  - Catalogo: http://localhost:8000/motos/')
