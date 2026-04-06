import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { clientesApi, motosApi, pagosApi, pedidosApi } from '../services/api'

export default function CheckoutPedido() {
  const { cliente, login } = useAuth()
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
    if (cliente) return cliente

    const loginPayload = {
      email: form.email,
      numero_documento: form.numero_documento,
    }

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

      const pago = await pagosApi.iniciar({
        pedido_id: pedido.id,
        gateway: 'mercadopago',
      })

      if (!pago.checkout_url) {
        throw new Error('No se pudo generar la URL de pago.')
      }

      window.location.href = pago.checkout_url
    } catch (err) {
      setError(err.message || 'No fue posible iniciar el pago.')
      setLoadingPago(false)
    }
  }

  return (
    <section className="premium-page">
      <div className="container-main" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <Link to={selectedMoto ? `/motos/${selectedMoto.id}` : '/motos'} className="detail-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver
        </Link>

        <div className="dashboard-header" style={{ marginTop: 10 }}>
          <div className="dashboard-header-left">
            <div className="dashboard-icon premium-icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12l3 6-3 12H6L3 9l3-6z"/><path d="M9 9h6"/></svg>
            </div>
            <div>
              <h1 className="dashboard-title">Checkout de Pedido</h1>
              <p className="dashboard-subtitle">Confirma tu moto e inicia el pago</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="login-alert-error" style={{ marginBottom: 18 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {error}
          </div>
        )}

        <div className="cita-grid">
          <div className="cita-sidebar">
            <div className="cita-info-card" style={{ marginBottom: 16 }}>
              <h4 className="cita-info-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Resumen
              </h4>
              {selectedMoto ? (
                <>
                  <p><strong>Moto:</strong> {selectedMoto.modelo}</p>
                  <p><strong>Precio:</strong> {selectedMoto.precio_formateado}</p>
                  <p><strong>Cantidad:</strong> {form.cantidad}</p>
                  <p style={{ marginTop: 10, fontWeight: 700 }}>Total estimado: {selectedMoto.precio_formateado}</p>
                </>
              ) : (
                <p>Selecciona una moto para continuar.</p>
              )}
            </div>

            <div className="cita-info-card">
              <h4 className="cita-info-title">Flujo de pago</h4>
              <p>1. Crear pedido</p>
              <p>2. Redirigir a pasarela</p>
              <p>3. Volver al sitio con resultado</p>
              <p>4. Ver estado en Mis pedidos y Mis pagos</p>
            </div>
          </div>

          <div className="cita-form-card">
            <form onSubmit={handleSubmit}>
              {!cliente && (
                <div className="cita-form-section">
                  <div className="cita-step">
                    <span className="cita-step-num">1</span>
                    <div>
                      <h3 className="cita-step-title">Datos del comprador</h3>
                      <p className="cita-step-sub">Si ya existe, te iniciamos sesion automaticamente</p>
                    </div>
                  </div>

                  <div className="cita-form-grid">
                    <div className="cita-field">
                      <label>Nombre completo <span>*</span></label>
                      <input type="text" required value={form.nombre} onChange={set('nombre')} placeholder="Ej: Juan Pérez" />
                    </div>
                    <div className="cita-field">
                      <label>Número documento <span>*</span></label>
                      <input type="text" required value={form.numero_documento} onChange={set('numero_documento')} placeholder="1234567890" />
                    </div>
                    <div className="cita-field">
                      <label>Email <span>*</span></label>
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

              {cliente && (
                <div className="cita-logged-in" style={{ marginBottom: 14 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Comprando como <strong>{cliente.nombre}</strong>
                </div>
              )}

              <div className="cita-form-section">
                <div className="cita-step">
                  <span className="cita-step-num">{cliente ? '1' : '2'}</span>
                  <div>
                    <h3 className="cita-step-title">Pedido</h3>
                    <p className="cita-step-sub">Selecciona la moto y confirma cantidad</p>
                  </div>
                </div>

                <div className="cita-form-grid">
                  <div className="cita-field">
                    <label>Moto <span>*</span></label>
                    <select required value={form.moto_id} onChange={set('moto_id')} disabled={loadingMotos}>
                      <option value="">Selecciona una moto</option>
                      {motos.map((m) => (
                        <option key={m.id} value={m.id}>{m.modelo} ({m.anio}) - {m.precio_formateado}</option>
                      ))}
                    </select>
                  </div>
                  <div className="cita-field">
                    <label>Cantidad</label>
                    <input type="number" min="1" max="5" value={form.cantidad} onChange={set('cantidad')} />
                  </div>
                </div>
              </div>

              <button type="submit" className="cita-submit-btn" disabled={loadingPago || !form.moto_id}>
                {loadingPago ? (
                  <span>Redirigiendo a pago...</span>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M1 12h22"/></svg>
                    Pagar con Mercado Pago
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-outline-yamaha"
                style={{ width: '100%', marginTop: 10 }}
                onClick={() => navigate('/mis-pedidos')}
              >
                Ver mis pedidos
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
