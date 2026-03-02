"""
Vistas para el modulo de motos.
Usa Class-Based Views siguiendo principios SOLID.
"""
from django.views.generic import ListView, DetailView
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Moto, Cita
from .services import MotoService
from .services.cliente_service import ClienteService
from .services.cita_service import CitaService


# ---------- Helper: sesion de cliente ----------
def _get_cliente(request):
    """Obtiene el cliente logueado desde la sesion."""
    cliente_id = request.session.get('cliente_id')
    if cliente_id:
        return ClienteService.obtener_cliente_por_pk(cliente_id)
    return None


# ---------- Motos ----------
class MotoListView(ListView):
    model = Moto
    template_name = 'motos/lista.html'
    context_object_name = 'motos'
    paginate_by = 12

    def get_queryset(self):
        queryset = MotoService.obtener_todas()

        categoria = self.request.GET.get('categoria')
        if categoria:
            queryset = MotoService.obtener_motos_por_categoria(categoria)

        search = self.request.GET.get('q')
        if search:
            queryset = MotoService.buscar_motos(search)

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categorias'] = MotoService.obtener_categorias()
        context['categoria_actual'] = self.request.GET.get('categoria', '')
        context['cliente'] = _get_cliente(self.request)
        return context


class MotoDetailView(DetailView):
    model = Moto
    template_name = 'motos/detalle.html'
    context_object_name = 'moto'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['cliente'] = _get_cliente(self.request)
        return context


def home_view(request):
    motos_destacadas = MotoService.obtener_todas()[:6]
    categorias = MotoService.obtener_categorias()

    context = {
        'motos_destacadas': motos_destacadas,
        'categorias': categorias,
        'cliente': _get_cliente(request),
    }
    return render(request, 'motos/home.html', context)


# ---------- Registro de Cliente ----------
def registro_view(request):
    if request.method == 'POST':
        data = {
            'nombre': request.POST.get('nombre', '').strip(),
            'email': request.POST.get('email', '').strip(),
            'telefono': request.POST.get('telefono', '').strip(),
            'numero_documento': request.POST.get('numero_documento', '').strip(),
            'ciudad': request.POST.get('ciudad', '').strip(),
            'direccion': request.POST.get('direccion', '').strip(),
            'departamento': request.POST.get('departamento', '').strip(),
        }
        try:
            cliente = ClienteService.crear_cliente(data)
            request.session['cliente_id'] = cliente.pk
            messages.success(request, f'Bienvenido, {cliente.nombre}. Tu cuenta ha sido creada.')
            next_url = request.POST.get('next', '')
            return redirect(next_url if next_url else 'home')
        except Exception as e:
            messages.error(request, f'Error al registrar: {e}')

    return render(request, 'motos/registro.html', {
        'next': request.GET.get('next', ''),
        'cliente': _get_cliente(request),
    })


# ---------- Login de Cliente (opcional, solo para comprar) ----------
def login_view(request):
    if request.method == 'POST':
        numero_documento = request.POST.get('numero_documento', '').strip()
        email = request.POST.get('email', '').strip()
        cliente = ClienteService.iniciar_sesion(email, numero_documento)
        if cliente:
            request.session['cliente_id'] = cliente.pk
            messages.success(request, f'Bienvenido de nuevo, {cliente.nombre}.')
            next_url = request.POST.get('next', '')
            return redirect(next_url if next_url else 'home')
        else:
            messages.error(request, 'No se encontro un cliente con esos datos. Verifica o registrate.')

    return render(request, 'motos/login.html', {
        'next': request.GET.get('next', ''),
        'cliente': _get_cliente(request),
    })


# ---------- Logout ----------
def logout_view(request):
    if 'cliente_id' in request.session:
        del request.session['cliente_id']
    messages.info(request, 'Has cerrado sesion.')
    return redirect('home')


# ---------- Agendar Cita ----------
def agendar_cita_view(request, pk=None):
    moto = get_object_or_404(Moto, pk=pk) if pk else None
    motos = MotoService.obtener_todas()
    cliente = _get_cliente(request)

    if request.method == 'POST':
        # Delegamos busqueda/creacion de cliente al Service Layer
        if cliente is None:
            try:
                cliente = ClienteService.obtener_o_crear_cliente({
                    'nombre': request.POST.get('nombre', '').strip(),
                    'email': request.POST.get('email', '').strip(),
                    'telefono': request.POST.get('telefono', '').strip(),
                    'numero_documento': request.POST.get('numero_documento', '').strip(),
                })
            except Exception as e:
                messages.error(request, f'Error con datos de cliente: {e}')
                return render(request, 'motos/agendar_cita.html', {
                    'moto': moto, 'motos': motos, 'cliente': None,
                })
            request.session['cliente_id'] = cliente.pk

        moto_id = request.POST.get('moto_id') or (pk if pk else None)
        moto_sel = get_object_or_404(Moto, pk=moto_id)
        fecha_str = request.POST.get('fecha', '')
        hora = request.POST.get('hora', '')
        canal = request.POST.get('canal_contacto', 'whatsapp')
        mensaje = request.POST.get('mensaje', '')

        try:
            cita = CitaService.agendar_cita(
                cliente=cliente,
                moto=moto_sel,
                fecha=fecha_str,
                hora=hora,
                canal_contacto=canal,
                mensaje=mensaje,
            )
            messages.success(request, f'Cita agendada para el {cita.fecha} a las {cita.hora}. Te contactaremos pronto.')
            return redirect('mis-citas')
        except Exception as e:
            messages.error(request, f'Error al agendar cita: {e}')

    # Rango de fechas delegado al Service Layer
    rango_fechas = CitaService.obtener_rango_fechas_disponibles()

    return render(request, 'motos/agendar_cita.html', {
        'moto': moto,
        'motos': motos,
        'cliente': cliente,
        'fecha_min': rango_fechas['fecha_min'],
        'fecha_max': rango_fechas['fecha_max'],
    })


# ---------- Mis Citas ----------
def mis_citas_view(request):
    cliente = _get_cliente(request)
    if not cliente:
        messages.info(request, 'Inicia sesion para ver tus citas.')
        return redirect('/login/?next=/mis-citas/')

    citas = CitaService.listar_citas_por_cliente(cliente.pk)
    return render(request, 'motos/mis_citas.html', {
        'citas': citas,
        'cliente': cliente,
    })


# ---------- Cancelar Cita ----------
def cancelar_cita_view(request, pk):
    cliente = _get_cliente(request)
    if not cliente:
        return redirect('/login/')

    cita = get_object_or_404(Cita, pk=pk, cliente=cliente)
    try:
        CitaService.cancelar_cita(cita)
        messages.success(request, 'Cita cancelada correctamente.')
    except ValueError as e:
        messages.error(request, str(e))
    return redirect('mis-citas')
