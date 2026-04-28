import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { clientesApi, motosApi, pagosApi, pedidosApi } from '../services/api'
import bancolombiaLogo from '../assets/bancolombia.png'
import visaLogo from '../assets/visa.jpg'
import mercadoPagoLogo from '../assets/mercadopago.png'
import pseLogo from '../assets/pse.jfif'

export default function CheckoutPedido() {
  const { cliente, login, logout } = useAuth()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const motoParam = params.get('moto')

  const [motos, setMotos] = useState([])
  const [loadingMotos, setLoadingMotos] = useState(true)
  const [loadingPago, setLoadingPago] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    numero_documento: '',
    moto_id: motoParam || '',
    cantidad: 1,
  })

  useEffect(() => {
    motosApi.list()
      .then((data) => setMotos(data.results || data))
      .catch(() => setMotos([]))
      .finally(() => setLoadingMotos(false))
  }, [])

  const selectedMoto = useMemo(
    () => motos.find((m) => String(m.id) === String(form.moto_id)),
    [motos, form.moto_id],
  )

  const set = (field) => (e) => {
    const value = field === 'cantidad' ? Number(e.target.value || 1) : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const ensureCliente = async () => {
    if (cliente) {
      try {
        const verified = await clientesApi.get(cliente.id)
        return verified
      } catch {
        logout()
      }
    }
    const loginPayload = { email: form.email, numero_documento: form.numero_documento }
    try {
      const existing = await clientesApi.login(loginPayload)
      login(existing)
      return existing
    } catch {
      const created = await clientesApi.create({
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        numero_documento: form.numero_documento,
      })
      login(created)
      return created
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoadingPago(true)
    try {
      const clienteActual = await ensureCliente()
      const pedido = await pedidosApi.create({
        cliente_id: clienteActual.id,
        moto_id: Number(form.moto_id),
        cantidad: Number(form.cantidad || 1),
      })
      const pago = await pagosApi.iniciar({ pedido_id: pedido.id, gateway: 'mercadopago' })
      if (!pago.checkout_url) throw new Error('No se pudo generar la URL de pago.')
      window.location.href = pago.checkout_url
    } catch (err) {
      setError(err.message || 'No fue posible iniciar el pago.')
      setLoadingPago(false)
    }
  }

  return (
    <section className="premium-page">
      <div className="container-main" style={{ paddingTop: 32, paddingBottom: 48 }}>

        <Link to={selectedMoto ? `/motos/${selectedMoto.id}` : '/motos'} className="detail-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver
        </Link>

        {/* ── Header ── */}
        <div style={{ marginTop: 12, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'linear-gradient(135deg, #009EE3 0%, #0077b6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: '#111' }}>
                Checkout de Pedido
              </h1>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', marginTop: 2 }}>
                Confirma tu moto e inicia el pago de forma segura
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="login-alert-error" style={{ marginBottom: 20 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {error}
          </div>
        )}

        <div className="cita-grid">

          {/* ── Sidebar ── */}
          <div className="cita-sidebar">

            {/* Resumen del pedido */}
            <div className="cita-info-card" style={{ marginBottom: 14 }}>
              <h4 className="cita-info-title" style={{ marginBottom: 14 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                Resumen del pedido
              </h4>

              {selectedMoto ? (
                <>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#111' }}>
                      {selectedMoto.modelo}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#6b7280' }}>
                      Año {selectedMoto.anio} · Cantidad: {form.cantidad}
                    </p>
                  </div>
                  <div style={{ paddingTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Precio unitario</span>
                      <span style={{ fontSize: '0.875rem', color: '#111' }}>{selectedMoto.precio_formateado}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Cantidad</span>
                      <span style={{ fontSize: '0.875rem', color: '#111' }}>× {form.cantidad}</span>
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      paddingTop: 10, borderTop: '1px solid #f0f0f0', marginTop: 4,
                    }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111' }}>Total</span>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#009EE3' }}>
                        {selectedMoto.precio_formateado}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                  Selecciona una moto para ver el resumen.
                </p>
              )}
            </div>

            {/* Métodos de pago aceptados */}
            <div className="cita-info-card" style={{ marginBottom: 14 }}>
              <h4 className="cita-info-title" style={{ marginBottom: 12 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Métodos de pago aceptados
              </h4>
              {/* Logo MP principal */}
              <div style={{ marginBottom: 12 }}>
                <img
                  src={mercadoPagoLogo}
                  alt="Mercado Pago"
                  style={{ height: 32, objectFit: 'contain', display: 'block' }}
                />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                {/* Visa */}
                <div style={badgeStyle}>
                  <img src={visaLogo} alt="Visa" style={{ height: 20, objectFit: 'contain', display: 'block' }} />
                </div>
                {/* Bancolombia */}
                <div style={badgeStyle}>
                  <img src={bancolombiaLogo} alt="Bancolombia" style={{ height: 20, objectFit: 'contain', display: 'block' }} />
                </div>
                {/* Mastercard */}
                <div style={badgeStyle}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#EB001B' }} />
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F79E1B', marginLeft: -9 }} />
                  </div>
                </div>
                {/* PSE */}
                <div style={badgeStyle}>
                  <img src={pseLogo} alt="PSE" style={{ height: 20, objectFit: 'contain', display: 'block' }} />
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#9ca3af' }}>
                Procesado de forma segura por Mercado Pago
              </p>
            </div>

            {/* Seguridad */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '12px 14px', background: '#f0fdf4', borderRadius: 10,
              border: '1px solid #bbf7d0',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.82rem', color: '#15803d' }}>
                  Pago 100% seguro
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#4ade80', color: '#166534' }}>
                  Tu información está cifrada con SSL
                </p>
              </div>
            </div>
          </div>

          {/* ── Form ── */}
          <div className="cita-form-card">
            <form onSubmit={handleSubmit}>

              {/* Datos del comprador */}
              {!cliente && (
                <div className="cita-form-section">
                  <div className="cita-step">
                    <span className="cita-step-num">1</span>
                    <div>
                      <h3 className="cita-step-title">Datos del comprador</h3>
                      <p className="cita-step-sub">Si ya tienes cuenta, iniciamos sesión automáticamente</p>
                    </div>
                  </div>
                  <div className="cita-form-grid">
                    <div className="cita-field">
                      <label>Nombre completo <span>*</span></label>
                      <input type="text" required value={form.nombre} onChange={set('nombre')} placeholder="Ej: Juan Pérez" />
                    </div>
                    <div className="cita-field">
                      <label>Número de documento <span>*</span></label>
                      <input type="text" required value={form.numero_documento} onChange={set('numero_documento')} placeholder="1234567890" />
                    </div>
                    <div className="cita-field">
                      <label>Correo electrónico <span>*</span></label>
                      <input type="email" required value={form.email} onChange={set('email')} placeholder="correo@ejemplo.com" />
                    </div>
                    <div className="cita-field">
                      <label>Teléfono <span>*</span></label>
                      <input type="tel" required value={form.telefono} onChange={set('telefono')} placeholder="+57 300 123 4567" />
                    </div>
                  </div>
                  <div className="cita-divider" />
                </div>
              )}

              {/* Badge sesión activa */}
              {cliente && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
                  padding: '10px 14px', background: '#f0fdf4', borderRadius: 10,
                  border: '1px solid #bbf7d0',
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: '#15803d' }}>
                      Comprando como <span style={{ color: '#111' }}>{cliente.nombre}</span>
                    </p>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#166534' }}>{cliente.email}</p>
                  </div>
                </div>
              )}

              {/* Selección de moto */}
              <div className="cita-form-section">
                <div className="cita-step">
                  <span className="cita-step-num">{cliente ? '1' : '2'}</span>
                  <div>
                    <h3 className="cita-step-title">Selección de moto</h3>
                    <p className="cita-step-sub">Elige el modelo y confirma la cantidad</p>
                  </div>
                </div>
                <div className="cita-form-grid">
                  <div className="cita-field">
                    <label>Moto <span>*</span></label>
                    <select required value={form.moto_id} onChange={set('moto_id')} disabled={loadingMotos}>
                      <option value="">Selecciona un modelo</option>
                      {motos.map((m) => (
                        <option key={m.id} value={m.id}>{m.modelo} ({m.anio}) — {m.precio_formateado}</option>
                      ))}
                    </select>
                  </div>
                  <div className="cita-field">
                    <label>Cantidad</label>
                    <input type="number" min="1" max="5" value={form.cantidad} onChange={set('cantidad')} />
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div style={{ height: 1, background: '#f0f0f0', margin: '4px 0 20px' }} />

              {/* Botón MercadoPago */}
              <button
                type="submit"
                disabled={loadingPago || !form.moto_id}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  background: loadingPago || !form.moto_id
                    ? '#888'
                    : 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: loadingPago || !form.moto_id ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  letterSpacing: '-0.01em',
                  boxShadow: loadingPago || !form.moto_id
                    ? 'none'
                    : '0 4px 18px rgba(0,0,0,0.25)',
                  transition: 'all 0.2s',
                  marginBottom: 10,
                  minHeight: 58,
                }}
              >
                {loadingPago ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Redirigiendo a Mercado Pago...
                  </>
                ) : (
                  <>
                    {/* Logo real en pill blanco */}
                    <div style={{
                      background: '#fff',
                      borderRadius: 8,
                      padding: '4px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                    }}>
                      <img
                        src={mercadoPagoLogo}
                        alt="Mercado Pago"
                        style={{ height: 24, objectFit: 'contain', display: 'block' }}
                      />
                    </div>
                    <span style={{ flex: 1, textAlign: 'left' }}>Pagar ahora</span>
                    {selectedMoto && (
                      <span style={{
                        background: 'rgba(255,255,255,0.22)',
                        padding: '3px 12px',
                        borderRadius: 20,
                        fontSize: '0.875rem',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                      }}>
                        {selectedMoto.precio_formateado}
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Botón secundario */}
              <button
                type="button"
                onClick={() => navigate('/mis-pedidos')}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: 'transparent',
                  color: '#6b7280',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 10,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.15s',
                  marginBottom: 16,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#374151' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                Ver mis pedidos
              </button>

              {/* Trust footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={trustItemStyle}>
                  <img src={mercadoPagoLogo} alt="Mercado Pago" style={{ height: 14, objectFit: 'contain' }} />
                </div>
                <div style={trustItemStyle}>
                  <img src={visaLogo} alt="Visa" style={{ height: 14, objectFit: 'contain' }} />
                </div>
                <div style={trustItemStyle}>
                  <img src={bancolombiaLogo} alt="Bancolombia" style={{ height: 14, objectFit: 'contain' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9ca3af', fontSize: '0.72rem' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  SSL seguro
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

const badgeStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '5px 10px',
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  minWidth: 60,
  minHeight: 36,
}

const trustItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '3px 8px',
  background: '#f9fafb',
  borderRadius: 6,
  border: '1px solid #f0f0f0',
}
