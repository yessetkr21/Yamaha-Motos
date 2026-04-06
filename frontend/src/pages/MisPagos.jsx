import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { pagosApi } from '../services/api'

const ESTADO_COLORS = {
  aprobado: '#10B981',
  pendiente: '#F59E0B',
  rechazado: '#EF4444',
  cancelado: '#6B7280',
  creado: '#3B82F6',
}

export default function MisPagos() {
  const { cliente } = useAuth()
  const navigate = useNavigate()

  const [pagos, setPagos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!cliente) {
      navigate('/login?next=/mis-pagos')
      return
    }

    pagosApi.list(cliente.id)
      .then((data) => setPagos(data.results || data))
      .catch((err) => setError(err.message || 'No se pudieron cargar los pagos.'))
      .finally(() => setLoading(false))
  }, [cliente])

  if (loading) {
    return (
      <section className="premium-page"><div className="container-main"><div className="detail-skeleton" /></div></section>
    )
  }

  return (
    <section className="premium-page">
      <div className="container-main">
        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <div className="dashboard-icon premium-icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>
            </div>
            <div>
              <h1 className="dashboard-title">Mis Pagos</h1>
              <p className="dashboard-subtitle">Seguimiento de pagos de tus pedidos</p>
            </div>
          </div>
          <Link to="/mis-pedidos" className="btn-outline-yamaha">Ver pedidos</Link>
        </div>

        {error && <div className="login-alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        {pagos.length > 0 ? (
          <div className="dashboard-grid">
            {pagos.map((pago) => (
              <div key={pago.id} className="dashboard-card dashboard-card-static">
                <div className="dc-header">
                  <span className="dc-number">PAGO #{pago.id}</span>
                  <span
                    className="status-badge"
                    style={{
                      background: (ESTADO_COLORS[pago.estado] || '#ccc') + '20',
                      color: ESTADO_COLORS[pago.estado] || '#555',
                      border: `1px solid ${(ESTADO_COLORS[pago.estado] || '#ccc')}40`,
                    }}
                  >
                    {pago.estado_display}
                  </span>
                </div>

                <div className="dc-body">
                  <h3 className="dc-title">{pago.pedido_numero}</h3>
                  <p><strong>Moto:</strong> {pago.moto_modelo}</p>
                  <p><strong>Monto:</strong> {pago.monto} {pago.moneda}</p>
                  <p><strong>Pasarela:</strong> {pago.gateway_display}</p>
                  <p><strong>Referencia:</strong> {pago.external_reference}</p>
                  {pago.detalle_estado && <p><strong>Detalle:</strong> {pago.detalle_estado}</p>}
                </div>

                <div className="dc-footer">
                  <span />
                  <Link to="/mis-pedidos" className="btn-outline-yamaha" style={{ padding: '8px 14px' }}>
                    Ir al pedido
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-premium">
            <div className="esp-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>
            </div>
            <h3>No tienes pagos registrados</h3>
            <p>Cuando inicies una compra, aquí verás el estado de cada pago.</p>
            <Link to="/motos" className="btn-primary-yamaha" style={{ marginTop: 18 }}>Ver motos</Link>
          </div>
        )}
      </div>
    </section>
  )
}
