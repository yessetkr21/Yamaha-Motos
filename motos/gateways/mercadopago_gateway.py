import json
import uuid
from urllib.parse import urlparse
from urllib import error as urllib_error
from urllib import request as urllib_request

from django.conf import settings

from .base import PaymentGateway


class MercadoPagoGateway(PaymentGateway):
    """Gateway de Mercado Pago con modo demo para entorno academico."""

    PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences"

    def __init__(self):
        self.access_token = getattr(settings, 'MERCADOPAGO_ACCESS_TOKEN', '').strip()
        frontend_base = str(getattr(
            settings,
            'PAYMENTS_FRONTEND_BASE_URL',
            'http://localhost:5173',
        )).strip().rstrip('/')
        self.frontend_base = frontend_base or 'http://localhost:5173'
        self.demo_mode = getattr(settings, 'PAYMENTS_DEMO_MODE', True)
        self.use_sandbox = getattr(settings, 'MERCADOPAGO_USE_SANDBOX', True)
        self.is_test_token = self.access_token.startswith(('TEST-', 'APP_USR-'))

    def create_checkout(self, pago) -> dict:
        if self.demo_mode or not self.access_token:
            return self._create_demo_checkout(pago)
        return self._create_real_checkout(pago)

    def normalize_return(self, params: dict) -> dict:
        raw_status = (
            params.get('status')
            or params.get('collection_status')
            or params.get('payment_status')
            or ''
        ).lower()
        status_map = {
            'approved': 'aprobado',
            'pending': 'pendiente',
            'in_process': 'pendiente',
            'inprocess': 'pendiente',
            'rejected': 'rechazado',
            'failed': 'rechazado',
            'cancelled': 'cancelado',
            'cancelled_by_user': 'cancelado',
        }
        estado = status_map.get(raw_status, 'pendiente')

        return {
            'estado': estado,
            'external_id': (
                params.get('payment_id')
                or params.get('collection_id')
                or params.get('external_id')
                or params.get('preference_id')
            ),
            'detalle_estado': params.get('status_detail') or params.get('detail') or '',
            'metadata': {
                'return_payload': params,
            },
        }

    def _create_demo_checkout(self, pago) -> dict:
        qs = (
            f"gateway=mercadopago&pago_id={pago.id}"
            f"&external_reference={pago.external_reference}&amount={pago.monto}"
        )
        return {
            'checkout_url': f"/pasarela-demo?{qs}",
            'external_id': f"demo_pref_{uuid.uuid4().hex[:12]}",
            'external_reference': pago.external_reference,
            'metadata': {
                'mode': 'demo',
                'provider': 'mercadopago',
            },
        }

    def _create_real_checkout(self, pago) -> dict:
        result_url = f"{self.frontend_base}/pago/resultado"
        use_sandbox_checkout = self.use_sandbox and self.is_test_token

        payload = {
            'items': [
                {
                    'title': f"Pedido {pago.pedido.numero_pedido}",
                    'quantity': 1,
                    'currency_id': pago.moneda,
                    'unit_price': float(pago.monto),
                }
            ],
            'external_reference': pago.external_reference,
            'back_urls': {
                'success': result_url,
                'failure': result_url,
                'pending': result_url,
            },
        }

        # In production we can prefill payer info; in sandbox this can cause
        # test/live account mismatch errors depending on the email used.
        if not use_sandbox_checkout:
            payload['payer'] = {
                'name': pago.pedido.cliente.nombre,
                'email': pago.pedido.cliente.email,
            }

        # Mercado Pago can reject auto_return for localhost/private callback URLs.
        if self._supports_auto_return(result_url):
            payload['auto_return'] = 'approved'

        data = json.dumps(payload).encode('utf-8')
        req = urllib_request.Request(
            self.PREFERENCES_URL,
            data=data,
            method='POST',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.access_token}',
            },
        )

        try:
            with urllib_request.urlopen(req, timeout=20) as response:
                body = response.read().decode('utf-8')
                mp_data = json.loads(body)
        except urllib_error.HTTPError as exc:
            detail = exc.read().decode('utf-8', errors='ignore')
            raise ValueError(f"Mercado Pago HTTP {exc.code}: {detail}") from exc
        except urllib_error.URLError as exc:
            raise ValueError(f"No fue posible conectar con Mercado Pago: {exc.reason}") from exc

        if use_sandbox_checkout:
            checkout_url = mp_data.get('sandbox_init_point') or mp_data.get('init_point')
        else:
            checkout_url = mp_data.get('init_point') or mp_data.get('sandbox_init_point')
        if not checkout_url:
            raise ValueError('Mercado Pago no retorno URL de checkout.')

        return {
            'checkout_url': checkout_url,
            'external_id': mp_data.get('id') or '',
            'external_reference': mp_data.get('external_reference') or pago.external_reference,
            'metadata': {
                'mode': 'sandbox' if use_sandbox_checkout else 'live',
                'provider': 'mercadopago',
            },
        }

    @staticmethod
    def _supports_auto_return(url: str) -> bool:
        parsed = urlparse(url)
        host = (parsed.hostname or '').lower()
        if parsed.scheme not in {'http', 'https'}:
            return False
        if host in {'localhost', '127.0.0.1', '0.0.0.0'}:
            return False
        return True
