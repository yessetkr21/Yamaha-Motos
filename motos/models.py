from django.db import models
from django.urls import reverse
from django.core.validators import MinValueValidator, RegexValidator


class Moto(models.Model):
    """Catalogo de motocicletas Yamaha Colombia."""
    CATEGORIAS = [
        ('sport', 'Sport'),
        ('touring', 'Touring'),
        ('naked', 'Naked'),
        ('adventure', 'Adventure'),
        ('scooter', 'Scooter'),
    ]

    modelo = models.CharField(max_length=200, verbose_name="Modelo")
    anio = models.IntegerField(verbose_name="Ano", validators=[MinValueValidator(2000)])
    cilindrada = models.IntegerField(
        verbose_name="Cilindrada (cc)",
        validators=[MinValueValidator(1)]
    )
    precio = models.DecimalField(
        max_digits=12, decimal_places=2, verbose_name="Precio (COP)",
        validators=[MinValueValidator(0)]
    )
    color = models.CharField(max_length=50, verbose_name="Color")
    stock = models.IntegerField(
        default=0, verbose_name="Stock",
        validators=[MinValueValidator(0)]
    )
    categoria = models.CharField(
        max_length=20, choices=CATEGORIAS, default='sport',
        verbose_name="Categoria"
    )
    imagen = models.ImageField(
        upload_to='motos/', verbose_name="Imagen", blank=True, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Moto"
        verbose_name_plural = "Motos"
        ordering = ['categoria', 'modelo']
        indexes = [
            models.Index(fields=['categoria']),
            models.Index(fields=['stock']),
        ]

    def __str__(self):
        return f"{self.modelo} ({self.anio}) - {self.color}"

    def get_absolute_url(self):
        return reverse('moto-detail', kwargs={'pk': self.pk})

    @property
    def precio_formateado(self):
        """Delegado a MotoService.formatear_precio() para cumplir SRP."""
        from motos.services.moto_service import MotoService
        return MotoService.formatear_precio(self)


class Cliente(models.Model):
    """Clientes del concesionario Yamaha."""
    nombre = models.CharField(max_length=200, verbose_name="Nombre")
    email = models.EmailField(unique=True, verbose_name="Email")
    telefono = models.CharField(
        max_length=15, verbose_name="Telefono",
        validators=[RegexValidator(r'^\+?[\d\s-]{7,15}$', 'Numero de telefono invalido')]
    )
    numero_documento = models.CharField(
        max_length=20, unique=True, verbose_name="Numero de Documento"
    )
    ciudad = models.CharField(max_length=100, verbose_name="Ciudad", blank=True)
    direccion = models.TextField(verbose_name="Direccion", blank=True)
    departamento = models.CharField(
        max_length=100, verbose_name="Departamento", blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        ordering = ['nombre']

    def __str__(self):
        return f"{self.nombre} ({self.numero_documento})"


class Pedido(models.Model):
    """Pedido directo online. Incluye datos de cantidad y precio de la moto."""
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmado', 'Confirmado'),
        ('en_preparacion', 'En Preparacion'),
        ('listo', 'Listo para Entrega'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]

    numero_pedido = models.CharField(
        max_length=20, unique=True, editable=False, verbose_name="Numero de Pedido"
    )
    cliente = models.ForeignKey(
        Cliente, on_delete=models.PROTECT, related_name='pedidos'
    )
    moto = models.ForeignKey(
        Moto, on_delete=models.PROTECT, related_name='pedidos'
    )
    fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha")
    estado = models.CharField(
        max_length=20, choices=ESTADO_CHOICES, default='pendiente',
        verbose_name="Estado"
    )
    cantidad = models.PositiveIntegerField(
        default=1, validators=[MinValueValidator(1)], verbose_name="Cantidad"
    )
    precio_unitario = models.DecimalField(
        max_digits=12, decimal_places=2, verbose_name="Precio Unitario"
    )
    subtotal = models.DecimalField(
        max_digits=12, decimal_places=2, default=0, verbose_name="Subtotal"
    )
    iva = models.DecimalField(
        max_digits=12, decimal_places=2, default=0, verbose_name="IVA"
    )
    total = models.DecimalField(
        max_digits=12, decimal_places=2, default=0, verbose_name="Total"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"
        ordering = ['-fecha']

    def __str__(self):
        return f"PED-{self.numero_pedido} - {self.cliente} ({self.get_estado_display()})"


class Cita(models.Model):
    """Reserva de cita para ver la moto en el concesionario."""
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
        ('completada', 'Completada'),
    ]

    CANAL_CONTACTO_CHOICES = [
        ('whatsapp', 'WhatsApp'),
        ('telefono', 'Telefono'),
        ('email', 'Email'),
        ('presencial', 'Presencial'),
    ]

    cliente = models.ForeignKey(
        Cliente, on_delete=models.PROTECT, related_name='citas'
    )
    moto = models.ForeignKey(
        Moto, on_delete=models.PROTECT, related_name='citas'
    )
    fecha = models.DateField(verbose_name="Fecha")
    hora = models.CharField(max_length=10, verbose_name="Hora")
    estado = models.CharField(
        max_length=20, choices=ESTADO_CHOICES, default='pendiente',
        verbose_name="Estado"
    )
    canal_contacto = models.CharField(
        max_length=20, choices=CANAL_CONTACTO_CHOICES, default='whatsapp',
        verbose_name="Canal de Contacto"
    )
    mensaje = models.TextField(blank=True, verbose_name="Mensaje")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Cita"
        verbose_name_plural = "Citas"
        ordering = ['-fecha', '-hora']

    def __str__(self):
        return f"CITA {self.fecha} {self.hora} - {self.cliente} ({self.get_estado_display()})"


class Pago(models.Model):
    """Estado de pago de un pedido con soporte para pasarelas externas."""

    ESTADO_CHOICES = [
        ('creado', 'Creado'),
        ('pendiente', 'Pendiente'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
        ('cancelado', 'Cancelado'),
    ]

    GATEWAY_CHOICES = [
        ('mercadopago', 'Mercado Pago'),
    ]

    pedido = models.OneToOneField(
        Pedido, on_delete=models.PROTECT, related_name='pago'
    )
    gateway = models.CharField(
        max_length=30, choices=GATEWAY_CHOICES, default='mercadopago'
    )
    estado = models.CharField(
        max_length=20, choices=ESTADO_CHOICES, default='creado'
    )
    monto = models.DecimalField(
        max_digits=12, decimal_places=2, validators=[MinValueValidator(0)]
    )
    moneda = models.CharField(max_length=3, default='COP')
    external_reference = models.CharField(max_length=120, unique=True)
    external_id = models.CharField(max_length=120, blank=True, null=True)
    checkout_url = models.URLField(blank=True, default='')
    detalle_estado = models.CharField(max_length=120, blank=True, default='')
    metadata = models.JSONField(default=dict, blank=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Pago"
        verbose_name_plural = "Pagos"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['estado'], name='motos_pago_estado_idx'),
            models.Index(fields=['gateway'], name='motos_pago_gateway_idx'),
            models.Index(fields=['external_reference'], name='motos_pago_extref_idx'),
        ]

    def __str__(self):
        return (
            f"PAGO-{self.id} {self.pedido.numero_pedido} "
            f"({self.get_estado_display()})"
        )
