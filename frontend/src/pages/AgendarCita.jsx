import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motosApi, citasApi, clientesApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const HORAS = [
  ['08:00', '08:00 AM'], ['09:00', '09:00 AM'], ['10:00', '10:00 AM'],
  ['11:00', '11:00 AM'], ['12:00', '12:00 PM'], ['14:00', '02:00 PM'],
  ['15:00', '03:00 PM'], ['16:00', '04:00 PM'], ['17:00', '05:00 PM'],
]

const CANALES = [
  { val: 'whatsapp',   label: 'WhatsApp',   color: '#25D366', icon: 'M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.136.301-.354.451-.524.146-.172.194-.295.297-.495.1-.198.05-.372-.025-.522-.075-.148-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 01-1.516-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
  { val: 'telefono',   label: 'Teléfono',   color: '#3B82F6', icon: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' },
  { val: 'email',      label: 'Email',      color: '#8B5CF6', icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' },
  { val: 'presencial', label: 'Presencial', color: '#F59E0B', icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' },
]

function pad(n) { return String(n).padStart(2, '0') }
function getFechaMin() {
  const d = new Date(); d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}
function getFechaMax() {
  const d = new Date(); d.setDate(d.getDate() + 60)
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}

export default function AgendarCita() {
  const { cliente, login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const motoId = params.get('moto')

  const [moto, setMoto] = useState(null)
  const [motos, setMotos] = useState([])
  const [form, setForm] = useState({
    nombre: '', email: '', telefono: '', numero_documento: '',
    moto_id: motoId || '',
    fecha: '', hora: '', canal_contacto: 'whatsapp', mensaje: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    motosApi.list().then(data => setMotos(data.results || data))
    if (motoId) motosApi.get(motoId).then(setMoto)
  }, [motoId])

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let clienteActual = cliente
      if (!clienteActual) {
        try {
          clienteActual = await clientesApi.login({ email: form.email, numero_documento: form.numero_documento })
        } catch {
          clienteActual = await clientesApi.create({
            nombre: form.nombre, email: form.email,
            telefono: form.telefono, numero_documento: form.numero_documento,
          })
        }
        login(clienteActual)
      }
      await citasApi.create({
        cliente_id: clienteActual.id,
        moto_id: form.moto_id,
        fecha: form.fecha,
        hora: form.hora,
        canal_contacto: form.canal_contacto,
        mensaje: form.mensaje,
      })
      setSuccess(`¡Cita confirmada para el ${form.fecha} a las ${form.hora}!`)
      setTimeout(() => navigate('/mis-citas'), 2500)
    } catch (err) {
      setError(err.message || 'Error al agendar la cita.')
    } finally {
      setLoading(false)
    }
  }

  const canalActivo = CANALES.find(c => c.val === form.canal_contacto)

  return (
    <section className="premium-page">
      <div className="container-main" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <Link to={moto ? `/motos/${moto.id}` : '/motos'} className="detail-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver
        </Link>

        <div className="dashboard-header" style={{ marginTop: 10 }}>
          <div className="dashboard-header-left">
            <div className="dashboard-icon premium-icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <h1 className="dashboard-title">Agendar Cita</h1>
              <p className="dashboard-subtitle">Reserva tu visita al concesionario</p>
            </div>
          </div>
        </div>

        <div className="cita-body" style={{ marginTop: 0 }}>
        <div>

          {success && (
            <div className="cita-success-banner">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              {success}
            </div>
          )}

          <div className="cita-grid">

            {/* Columna izquierda */}
            <div className="cita-sidebar">
              {/* Moto seleccionada */}
              {moto && (
                <div className="cita-moto-card">
                  {moto.imagen && (
                    <div className="cita-moto-img-wrap">
                      <img src={moto.imagen} alt={moto.modelo} className="cita-moto-img" />
                    </div>
                  )}
                  <div className="cita-moto-info">
                    <span className="cita-moto-badge">Moto seleccionada</span>
                    <h3 className="cita-moto-name">{moto.modelo.toUpperCase()}</h3>
                    <p className="cita-moto-meta">{moto.anio} · {moto.color} · {moto.cilindrada}cc</p>
                    <span className="cita-moto-price">{moto.precio_formateado}</span>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="cita-info-card">
                <h4 className="cita-info-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Información
                </h4>
                <div className="cita-info-item">
                  <div className="cita-info-icon" style={{ background: 'rgba(230,0,18,.1)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E60012" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div>
                    <strong>Horario</strong>
                    <span>Lun – Sab, 8:00 AM – 5:00 PM</span>
                  </div>
                </div>
                <div className="cita-info-item">
                  <div className="cita-info-icon" style={{ background: 'rgba(230,0,18,.1)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E60012" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <strong>Ubicación</strong>
                    <span>Concesionario Yamaha, Colombia</span>
                  </div>
                </div>
                <div className="cita-info-item">
                  <div className="cita-info-icon" style={{ background: 'rgba(230,0,18,.1)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E60012" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72"/></svg>
                  </div>
                  <div>
                    <strong>Confirmación</strong>
                    <span>Te contactamos en &lt; 24 horas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="cita-form-card">
              {error && (
                <div className="cita-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Datos del cliente */}
                {!cliente ? (
                  <div className="cita-form-section">
                    <div className="cita-step">
                      <span className="cita-step-num">1</span>
                      <div>
                        <h3 className="cita-step-title">Tus datos</h3>
                        <p className="cita-step-sub">Necesitamos tu información para la cita</p>
                      </div>
                    </div>
                    <div className="cita-form-grid">
                      <div className="cita-field">
                        <label>Nombre completo <span>*</span></label>
                        <input type="text" required placeholder="Ej: Juan Pérez" value={form.nombre} onChange={set('nombre')} />
                      </div>
                      <div className="cita-field">
                        <label>Nº Documento <span>*</span></label>
                        <input type="text" required placeholder="1234567890" value={form.numero_documento} onChange={set('numero_documento')} />
                      </div>
                      <div className="cita-field">
                        <label>Correo electrónico <span>*</span></label>
                        <input type="email" required placeholder="correo@ejemplo.com" value={form.email} onChange={set('email')} />
                      </div>
                      <div className="cita-field">
                        <label>Teléfono <span>*</span></label>
                        <input type="tel" required placeholder="+57 300 123 4567" value={form.telefono} onChange={set('telefono')} />
                      </div>
                    </div>
                    <div className="cita-divider" />
                  </div>
                ) : (
                  <div className="cita-logged-in">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Agendando como <strong>{cliente.nombre}</strong>
                  </div>
                )}

                {/* Detalles de la cita */}
                <div className="cita-form-section">
                  <div className="cita-step">
                    <span className="cita-step-num">{cliente ? '1' : '2'}</span>
                    <div>
                      <h3 className="cita-step-title">Detalles de la cita</h3>
                      <p className="cita-step-sub">Fecha, hora y canal preferido</p>
                    </div>
                  </div>

                  {!moto && (
                    <div className="cita-field" style={{ marginBottom: 16 }}>
                      <label>Moto que deseas ver <span>*</span></label>
                      <select required value={form.moto_id} onChange={set('moto_id')}>
                        <option value="">Selecciona una moto</option>
                        {motos.map(m => (
                          <option key={m.id} value={m.id}>{m.modelo} ({m.anio}) — {m.precio_formateado}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="cita-form-grid">
                    <div className="cita-field">
                      <label>Fecha <span>*</span></label>
                      <input type="date" required min={getFechaMin()} max={getFechaMax()} value={form.fecha} onChange={set('fecha')} />
                    </div>
                    <div className="cita-field">
                      <label>Hora <span>*</span></label>
                      <select required value={form.hora} onChange={set('hora')}>
                        <option value="">Selecciona hora</option>
                        {HORAS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Canal */}
                  <div className="cita-field">
                    <label>Canal de contacto preferido</label>
                    <div className="cita-canales">
                      {CANALES.map(c => (
                        <button
                          key={c.val}
                          type="button"
                          className={`cita-canal-btn${form.canal_contacto === c.val ? ' active' : ''}`}
                          style={form.canal_contacto === c.val ? { '--canal-color': c.color } : {}}
                          onClick={() => setForm(p => ({ ...p, canal_contacto: c.val }))}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={form.canal_contacto === c.val ? c.color : 'currentColor'}>
                            <path d={c.icon} />
                          </svg>
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div className="cita-field">
                    <label>Mensaje <span className="cita-optional">(opcional)</span></label>
                    <textarea
                      rows="3"
                      placeholder="Ej: Me gustaría ver la moto en color azul..."
                      value={form.mensaje}
                      onChange={set('mensaje')}
                    />
                  </div>
                </div>

                <button type="submit" className="cita-submit-btn" disabled={loading}>
                  {loading ? (
                    <span>Agendando cita...</span>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Confirmar Cita
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
