import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { pagosApi, pedidosApi } from '../services/api'

const ESTADO_COLORS = {
  pendiente: '#F59E0B',
  confirmado: '#10B981',
  en_preparacion: '#3B82F6',
  listo: '#4F46E5',
  entregado: '#6B7280',
  cancelado: '#EF4444',
}

export default function MisPedidos() {
  const { cliente } = useAuth()
  const navigate = useNavigate()

  const [pedidos, setPedidos] = useState([])
  const [pagos, setPagos] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!cliente) {
      navigate('/login?next=/mis-pedidos')
      return
    }

    Promise.all([
      pedidosApi.list(cliente.id),
      pagosApi.list(cliente.id),
    ])
      .then(([pedidosData, pagosData]) => {
        setPedidos(pedidosData.results || pedidosData)
        setPagos(pagosData.results || pagosData)
      })
      .catch(() => setMsg('No se pudo cargar tu historial.'))
      .finally(() => setLoading(false))
  }, [cliente])

  const pagosByPedido = useMemo(() => {
    const map = {}
    pagos.forEach((p) => { map[p.pedido] = p })
    return map
  }, [pagos])

  const pagarPedido = async (pedido) => {
    try {
      const currentPago = pagosByPedido[pedido.id]
      if (currentPago?.checkout_url && currentPago.estado === 'pendiente') {
        window.location.href = currentPago.checkout_url
        return
      }

      const pago = await pagosApi.iniciar({ pedido_id: pedido.id, gateway: 'mercadopago' })
      window.location.href = pago.checkout_url
    } catch (err) {
      setMsg(err.message || 'No fue posible iniciar el pago.')
    }
  }

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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12l3 6-3 12H6L3 9l3-6z"/></svg>
            </div>
            <div>
              <h1 className="dashboard-title">Mis Pedidos</h1>
              <p className="dashboard-subtitle">Historial de compras y estado de entrega</p>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary-yamaha">Nuevo pedido</Link>
        </div>

        {msg && <div className="login-alert-error" style={{ marginBottom: 18 }}>{msg}</div>}

        {pedidos.length > 0 ? (
          <div className="dashboard-grid">
            {pedidos.map((pedido) => {
              const pago = pagosByPedido[pedido.id]
              const showPayBtn = pedido.estado === 'pendiente' && (!pago || pago.estado !== 'aprobado')

              return (
                <div key={pedido.id} className="dashboard-card dashboard-card-static">
                  <div className="dc-header">
                    <span className="dc-number">{pedido.numero_pedido}</span>
                    <span
                      className="status-badge"
                      style={{
                        background: (ESTADO_COLORS[pedido.estado] || '#ccc') + '20',
                        color: ESTADO_COLORS[pedido.estado] || '#555',
                        border: `1px solid ${(ESTADO_COLORS[pedido.estado] || '#ccc')}40`,
                      }}
                    >
                      {pedido.estado_display}
                    </span>
                  </div>

                  <div className="dc-body">
                    <h3 className="dc-title">{pedido.moto_modelo?.toUpperCase()}</h3>
                    <p><strong>Cantidad:</strong> {pedido.cantidad}</p>
                    <p><strong>Total:</strong> {pedido.total}</p>
                    <p><strong>Fecha:</strong> {String(pedido.fecha).slice(0, 10)}</p>
                    <p>
                      <strong>Pago:</strong>{' '}
                      {pago ? `${pago.estado_display} (${pago.gateway_display})` : 'Sin iniciar'}
                    </p>
                  </div>

                  {showPayBtn && (
                    <div className="dc-footer">
                      <span />
                      <button className="btn-primary-yamaha" style={{ padding: '8px 14px' }} onClick={() => pagarPedido(pedido)}>
                        Pagar ahora
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state-premium">
            <div className="esp-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3h12l3 6-3 12H6L3 9l3-6z"/></svg>
            </div>
            <h3>No tienes pedidos registrados</h3>
            <p>Selecciona una moto y completa tu primera compra.</p>
            <Link to="/motos" className="btn-primary-yamaha" style={{ marginTop: 18 }}>Comprar moto</Link>
          </div>
        )}
      </div>
    </section>
  )
}
