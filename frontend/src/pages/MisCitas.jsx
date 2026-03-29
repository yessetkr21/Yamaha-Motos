import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { citasApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const ESTADO_COLORS = {
  pendiente: '#F59E0B',
  confirmada: '#10B981',
  cancelada: '#EF4444',
  completada: '#6B7280',
}

export default function MisCitas() {
  const { cliente } = useAuth()
  const navigate = useNavigate()
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!cliente) { navigate('/login?next=/mis-citas'); return }
    citasApi.list(cliente.id).then(data => {
      setCitas(data.results || data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [cliente])

  const cancelar = async (pk) => {
    if (!window.confirm('¿Seguro que deseas cancelar esta cita?')) return
    try {
      await citasApi.cancelar(pk)
      setCitas(prev => prev.map(c => c.id === pk ? { ...c, estado: 'cancelada', estado_display: 'Cancelada' } : c))
      setMsg('Cita cancelada correctamente.')
    } catch (err) {
      setMsg(err.message || 'No se pudo cancelar la cita.')
    }
  }

  if (loading) return (
    <section className="premium-page"><div className="container-main"><div className="detail-skeleton" /></div></section>
  )

  return (
    <section className="premium-page">
      <div className="container-main">
        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <div className="dashboard-icon premium-icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <h1 className="dashboard-title">Mis Citas</h1>
              <p className="dashboard-subtitle">Citas agendadas en el concesionario</p>
            </div>
          </div>
          <Link to="/citas/agendar" className="btn-primary-yamaha">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva Cita
          </Link>
        </div>

        {msg && (
          <div className="login-alert-success" style={{ marginBottom: 20 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            {msg}
          </div>
        )}

        {citas.length > 0 ? (
          <div className="dashboard-grid">
            {citas.map(cita => (
              <div key={cita.id} className="dashboard-card dashboard-card-static">
                <div className="dc-header">
                  <span className="dc-number">CITA #{cita.id}</span>
                  <span
                    className="status-badge"
                    style={{ background: (ESTADO_COLORS[cita.estado] || '#ccc') + '20', color: ESTADO_COLORS[cita.estado] || '#555', border: `1px solid ${ESTADO_COLORS[cita.estado] || '#ccc'}40` }}
                  >
                    {cita.estado_display}
                  </span>
                </div>
                <div className="dc-body">
                  <h3 className="dc-title">{cita.moto_modelo?.toUpperCase()}</h3>
                  <div className="dc-meta-row">
                    <span className="dc-meta">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {cita.fecha}
                    </span>
                    <span className="dc-meta">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {cita.hora}
                    </span>
                  </div>
                  <div className="dc-meta-row">
                    <span className="dc-meta">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72"/></svg>
                      {cita.canal_display}
                    </span>
                  </div>
                  {cita.mensaje && (
                    <div className="dc-message">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                      {cita.mensaje}
                    </div>
                  )}
                </div>
                {(cita.estado === 'pendiente' || cita.estado === 'confirmada') && (
                  <div className="dc-footer">
                    <span />
                    <button className="btn-cancel-sm" onClick={() => cancelar(cita.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      Cancelar Cita
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-premium">
            <div className="esp-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <h3>No tienes citas agendadas</h3>
            <p>Agenda una cita para ver la moto de tus sueños en nuestro concesionario.</p>
            <Link to="/citas/agendar" className="btn-primary-yamaha" style={{ marginTop: 20 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Agendar Cita
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
