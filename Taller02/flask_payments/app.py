"""
Microservicio Flask — Procesamiento de Pagos (Strangler Pattern)
Reemplaza la lógica de MercadoPago que antes bloqueaba el hilo principal de Django.
Expuesto en /api/v2/pagos/
"""
import json
import os
import uuid
from urllib import error as urllib_error
from urllib import request as urllib_request
from urllib.parse import urlparse

from flask import Flask, jsonify, request

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Configuración (env vars, igual que en Django)
# ---------------------------------------------------------------------------
ACCESS_TOKEN = os.environ.get("MERCADOPAGO_ACCESS_TOKEN", "").strip()
USE_SANDBOX = os.environ.get("MERCADOPAGO_USE_SANDBOX", "1") == "1"
DEMO_MODE = os.environ.get("PAYMENTS_DEMO_MODE", "1") == "1"
FRONTEND_BASE = os.environ.get("PAYMENTS_FRONTEND_BASE_URL", "http://localhost:5173").rstrip("/")

PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences"

STATUS_MAP = {
    "approved": "aprobado",
    "pending": "pendiente",
    "in_process": "pendiente",
    "inprocess": "pendiente",
    "rejected": "rechazado",
    "failed": "rechazado",
    "cancelled": "cancelado",
    "cancelled_by_user": "cancelado",
}


# ---------------------------------------------------------------------------
# Helpers internos
# ---------------------------------------------------------------------------

def _supports_auto_return(url: str) -> bool:
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    if parsed.scheme not in {"http", "https"}:
        return False
    return host not in {"localhost", "127.0.0.1", "0.0.0.0"}


def _create_demo_checkout(data: dict) -> dict:
    pago_id = data.get("pago_id", "")
    external_reference = data.get("external_reference", str(uuid.uuid4()))
    monto = data.get("monto", 0)
    qs = (
        f"gateway=mercadopago&pago_id={pago_id}"
        f"&external_reference={external_reference}&amount={monto}"
    )
    return {
        "checkout_url": f"/pasarela-demo?{qs}",
        "external_id": f"demo_pref_{uuid.uuid4().hex[:12]}",
        "external_reference": external_reference,
        "metadata": {"mode": "demo", "provider": "mercadopago"},
    }


def _create_real_checkout(data: dict) -> dict:
    result_url = f"{FRONTEND_BASE}/pago/resultado"
    is_test_token = ACCESS_TOKEN.startswith("TEST-")
    use_sandbox_checkout = USE_SANDBOX and is_test_token
    external_reference = data.get("external_reference", str(uuid.uuid4()))

    payload = {
        "items": [
            {
                "title": f"Pedido {data.get('numero_pedido', '')}",
                "quantity": 1,
                "currency_id": data.get("moneda", "COP"),
                "unit_price": float(data.get("monto", 0)),
            }
        ],
        "external_reference": external_reference,
        "back_urls": {
            "success": result_url,
            "failure": result_url,
            "pending": result_url,
        },
    }

    if not use_sandbox_checkout and data.get("cliente_nombre") and data.get("cliente_email"):
        payload["payer"] = {
            "name": data["cliente_nombre"],
            "email": data["cliente_email"],
        }

    if _supports_auto_return(result_url):
        payload["auto_return"] = "approved"

    encoded = json.dumps(payload).encode("utf-8")
    req = urllib_request.Request(
        PREFERENCES_URL,
        data=encoded,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {ACCESS_TOKEN}",
        },
    )

    try:
        with urllib_request.urlopen(req, timeout=20) as resp:
            mp_data = json.loads(resp.read().decode("utf-8"))
    except urllib_error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise ValueError(f"MercadoPago HTTP {exc.code}: {detail}") from exc
    except urllib_error.URLError as exc:
        raise ValueError(f"No fue posible conectar con MercadoPago: {exc.reason}") from exc

    if use_sandbox_checkout:
        checkout_url = mp_data.get("sandbox_init_point") or mp_data.get("init_point")
    else:
        checkout_url = mp_data.get("init_point") or mp_data.get("sandbox_init_point")

    if not checkout_url:
        raise ValueError("MercadoPago no retornó URL de checkout.")

    return {
        "checkout_url": checkout_url,
        "external_id": mp_data.get("id", ""),
        "external_reference": mp_data.get("external_reference", external_reference),
        "metadata": {
            "mode": "sandbox" if use_sandbox_checkout else "live",
            "provider": "mercadopago",
        },
    }


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.route("/api/v2/pagos/iniciar/", methods=["POST"])
def iniciar_pago():
    """
    Recibe datos del pedido/pago y devuelve la URL de checkout de MercadoPago.
    Body JSON esperado:
      - pago_id (int, opcional)
      - pedido_id (int, requerido)
      - numero_pedido (str, requerido)
      - monto (float, requerido)
      - moneda (str, default "COP")
      - external_reference (str, requerido)
      - cliente_nombre (str, opcional)
      - cliente_email (str, opcional)
    """
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"error": "Body JSON requerido."}), 400

    required = ["pedido_id", "numero_pedido", "monto", "external_reference"]
    missing = [f for f in required if not body.get(f)]
    if missing:
        return jsonify({"error": f"Campos requeridos faltantes: {', '.join(missing)}"}), 400

    try:
        monto = float(body["monto"])
        if monto <= 0:
            return jsonify({"error": "El monto debe ser mayor a 0."}), 400
    except (TypeError, ValueError):
        return jsonify({"error": "monto debe ser un número válido."}), 400

    try:
        if DEMO_MODE or not ACCESS_TOKEN:
            result = _create_demo_checkout(body)
        else:
            result = _create_real_checkout(body)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 502

    return jsonify(result), 201


@app.route("/api/v2/pagos/confirmar-retorno/", methods=["POST"])
def confirmar_retorno():
    """
    Normaliza los parámetros de retorno de MercadoPago.
    Body JSON esperado:
      - params (dict con status, payment_id, collection_id, etc.)
    Retorna el estado normalizado en español.
    """
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"error": "Body JSON requerido."}), 400

    params = body.get("params", body)

    raw_status = (
        params.get("status")
        or params.get("collection_status")
        or params.get("payment_status")
        or ""
    ).lower()

    estado = STATUS_MAP.get(raw_status, "pendiente")

    result = {
        "estado": estado,
        "external_id": (
            params.get("payment_id")
            or params.get("collection_id")
            or params.get("external_id")
            or params.get("preference_id")
        ),
        "detalle_estado": params.get("status_detail") or params.get("detail") or "",
        "metadata": {"return_payload": params},
    }

    return jsonify(result), 200


@app.route("/api/v2/pagos/health/", methods=["GET"])
def health():
    """Health check del microservicio."""
    return jsonify({
        "status": "ok",
        "service": "flask-payments",
        "demo_mode": DEMO_MODE,
        "gateway": "mercadopago",
    }), 200


# ---------------------------------------------------------------------------
# Manejo de errores estructurado
# ---------------------------------------------------------------------------

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint no encontrado."}), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "Método HTTP no permitido."}), 405


@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Error interno del servidor."}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
