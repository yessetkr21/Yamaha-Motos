import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { pagosApi } from '../services/api'

const STATUS_UI = {
  aprobado: {
    title: 'Pago aprobado',
    message: 'Tu pedido fue confirmado correctamente.',
    className: 'login-alert-success',
  },
  pendiente: {
    title: 'Pago pendiente',
    message: 'Estamos esperando confirmación final del pago.',
    className: 'login-alert-success',
  },
  rechazado: {
    title: 'Pago rechazado',
    message: 'No fue posible procesar el pago. Puedes reintentar desde Mis pedidos.',
    className: 'login-alert-error',
  },
  cancelado: {
    title: 'Pago cancelado',
    message: 'El pago fue cancelado. Puedes reintentarlo cuando quieras.',
    className: 'login-alert-error',
  },
}

export default function PagoResultado() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [pago, setPago] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const query = Object.fromEntries(params.entries())
    const pagoId = query.pago_id ? Number(query.pago_id) : null
    const externalReference = query.external_reference || null

    if (!pagoId && !externalReference) {
      setError('No se recibió información de pago para validar.')
      setLoading(false)
      return
    }

    pagosApi.confirmarRetorno({
      pago_id: pagoId || undefined,
      external_reference: externalReference || undefined,
      params: query,
    })
      .then((data) => setPago(data))
      .catch((err) => setError(err.message || 'No se pudo confirmar el pago.'))
      .finally(() => setLoading(false))
  }, [params])

  const ui = useMemo(() => {
    if (!pago) return null
    return STATUS_UI[pago.estado] || STATUS_UI.pendiente
  }, [pago])

  if (loading) {
    return (
      <section className="premium-page">
        <div className="container-main" style={{ paddingTop: 40 }}>
          <div className="detail-skeleton" />
        </div>
      </section>
    )
  }

  return (
    <section className="premium-page">
      <div className="container-main" style={{ maxWidth: 760, paddingTop: 36, paddingBottom: 36 }}>
        <div className="login-card" style={{ maxWidth: '100%' }}>
          <div className="login-card-header">
            <div className="login-brand">Resultado de pago</div>
            <h1 className="login-title" style={{ marginTop: 8 }}>
              {ui ? ui.title : 'No fue posible validar el pago'}
            </h1>
            <p className="login-subtitle">Tu compra de moto ya quedó registrada en el sistema.</p>
          </div>

          <div className="login-card-body">
            {error && <div className="login-alert-error">{error}</div>}

            {pago && ui && (
              <>
                <div className={ui.className} style={{ marginBottom: 16 }}>{ui.message}</div>

                <div className="cita-info-card" style={{ marginBottom: 20 }}>
                  <p><strong>Pedido:</strong> {pago.pedido_numero}</p>
                  <p><strong>Moto:</strong> {pago.moto_modelo}</p>
                  <p><strong>Monto:</strong> {pago.monto} {pago.moneda}</p>
                  <p><strong>Estado pago:</strong> {pago.estado_display}</p>
                  <p><strong>Estado pedido:</strong> {pago.pedido_estado}</p>
                </div>
              </>
            )}

            <div style={{ display: 'grid', gap: 10 }}>
              <button className="cita-submit-btn" onClick={() => navigate('/mis-pedidos')}>
                Ver mis pedidos
              </button>
              <Link to="/motos" className="btn-outline-yamaha" style={{ textAlign: 'center' }}>
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
