import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { clientesApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Registro() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/'

  const [form, setForm] = useState({
    nombre: '', email: '', telefono: '', numero_documento: '',
    ciudad: '', departamento: '', direccion: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await clientesApi.create(form)
      login(data)
      navigate(next)
    } catch (err) {
      setError(err.message || 'Error al registrar. Verifica los datos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 520 }}>
        <div className="login-card-header">
          <div className="login-brand">Yamaha Motos</div>
          <div className="login-avatar">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <h1 className="login-title">Crear Cuenta</h1>
          <p className="login-subtitle">Completa tus datos para registrarte</p>
        </div>

        <div className="login-card-body">
          {error && (
            <div className="login-alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-section-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Información personal
            </div>

            <div className="form-row-2 mb-3">
              <div>
                <label className="login-label">Nombre completo <span style={{ color: '#cc0000' }}>*</span></label>
                <input type="text" required placeholder="Ej: Juan Pérez" className="login-input" value={form.nombre} onChange={set('nombre')} />
              </div>
              <div>
                <label className="login-label">Nº documento <span style={{ color: '#cc0000' }}>*</span></label>
                <input type="text" required placeholder="Ej: 1234567890" className="login-input" value={form.numero_documento} onChange={set('numero_documento')} />
              </div>
            </div>
            <div className="form-row-2 mb-3">
              <div>
                <label className="login-label">Correo electrónico <span style={{ color: '#cc0000' }}>*</span></label>
                <input type="email" required placeholder="correo@ejemplo.com" className="login-input" value={form.email} onChange={set('email')} />
              </div>
              <div>
                <label className="login-label">Teléfono <span style={{ color: '#cc0000' }}>*</span></label>
                <input type="tel" required placeholder="+57 300 123 4567" className="login-input" value={form.telefono} onChange={set('telefono')} />
              </div>
            </div>

            <div className="login-section-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Ubicación <span style={{ fontWeight: 400, color: '#9ca3af', textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>(opcional)</span>
            </div>

            <div className="form-row-2 mb-3">
              <div>
                <label className="login-label">Ciudad</label>
                <input type="text" placeholder="Ej: Bogotá" className="login-input" value={form.ciudad} onChange={set('ciudad')} />
              </div>
              <div>
                <label className="login-label">Departamento</label>
                <input type="text" placeholder="Ej: Cundinamarca" className="login-input" value={form.departamento} onChange={set('departamento')} />
              </div>
            </div>
            <div className="mb-3">
              <label className="login-label">Dirección</label>
              <input type="text" placeholder="Ej: Carrera 7 #45-67, Apto 301" className="login-input" value={form.direccion} onChange={set('direccion')} />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
            </button>
          </form>

          <div className="login-divider"><span>¿Ya tienes cuenta?</span></div>
          <Link to={`/login${next !== '/' ? '?next=' + next : ''}`} className="login-register-link">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
