import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { clientesApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/'

  const [form, setForm] = useState({ numero_documento: '', email: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await clientesApi.login(form)
      login(data)
      navigate(next)
    } catch (err) {
      setError(err.message || 'No se encontró un cliente con esos datos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#0A0A0A',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Panel izquierdo — imagen/branding ── */}
      <div style={{
        display: 'none',
        flex: '0 0 52%',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="login-left-panel"
      >
        <img
          src="/static/images/iniciarsesionfoto.jpg"
          alt="Yamaha"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(230,0,18,0.35) 0%, rgba(0,0,0,0.7) 100%)',
        }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '48px 52px' }}>
          <div style={{ width: 40, height: 3, background: '#E60012', marginBottom: 20 }} />
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Tu próxima<br />aventura<br />te espera.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.65, maxWidth: 340 }}>
            Accede a tu cuenta para agendar citas, seguir tus pedidos y disfrutar de la experiencia Yamaha completa.
          </p>
        </div>
      </div>

      {/* Glow de fondo para versión mobile/única columna */}
      <div style={{
        position: 'absolute',
        top: '20%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(230,0,18,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Panel derecho — formulario ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: 420 }}
        >

          {/* Logo + título */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <img
                src="/static/images/logo-yamaha.png"
                alt="Yamaha"
                style={{ height: 28, filter: 'brightness(0) invert(1)' }}
                onError={e => e.target.style.display = 'none'}
              />
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>|</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600 }}>Mi cuenta</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 8 }}>
              Bienvenido<br />de vuelta
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.5 }}>
              Ingresa con tu documento y correo electrónico
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  background: 'rgba(230,0,18,0.12)',
                  border: '1px solid rgba(230,0,18,0.3)',
                  borderRadius: 12, padding: '12px 14px',
                  marginBottom: 20, color: '#ff6b6b', fontSize: 13, lineHeight: 1.4,
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Documento */}
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                Número de documento
              </label>
              <div style={{ position: 'relative' }}>
                <FileText
                  size={15}
                  style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    color: focused === 'doc' ? '#E60012' : 'rgba(255,255,255,0.3)',
                    transition: 'color 0.2s', pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  required
                  placeholder="Ej: 1234567890"
                  value={form.numero_documento}
                  onChange={e => setForm({ ...form, numero_documento: e.target.value })}
                  onFocus={() => setFocused('doc')}
                  onBlur={() => setFocused(null)}
                  style={{
                    width: '100%',
                    background: focused === 'doc' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${focused === 'doc' ? '#E60012' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 12,
                    padding: '13px 14px 13px 40px',
                    color: '#fff',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    boxShadow: focused === 'doc' ? '0 0 0 3px rgba(230,0,18,0.12)' : 'none',
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                Correo electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={15}
                  style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    color: focused === 'email' ? '#E60012' : 'rgba(255,255,255,0.3)',
                    transition: 'color 0.2s', pointerEvents: 'none',
                  }}
                />
                <input
                  type="email"
                  required
                  placeholder="correo@ejemplo.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  style={{
                    width: '100%',
                    background: focused === 'email' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${focused === 'email' ? '#E60012' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 12,
                    padding: '13px 14px 13px 40px',
                    color: '#fff',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    boxShadow: focused === 'email' ? '0 0 0 3px rgba(230,0,18,0.12)' : 'none',
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              style={{
                marginTop: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: loading ? 'rgba(230,0,18,0.5)' : '#E60012',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '14px 24px',
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s, box-shadow 0.2s',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(230,0,18,0.35)',
                fontFamily: 'inherit',
                letterSpacing: '-0.01em',
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                  />
                  Ingresando...
                </>
              ) : (
                <>
                  Ingresar a mi cuenta
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider + registro */}
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>¿No tienes cuenta?</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>
            <Link
              to={`/registro${next !== '/' ? '?next=' + next : ''}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: '#fff',
                fontSize: 14, fontWeight: 600,
                padding: '12px 28px',
                borderRadius: 12,
                border: '1.5px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                textDecoration: 'none',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            >
              Registrarse gratis
            </Link>
          </div>

        </motion.div>
      </div>

      {/* CSS para mostrar panel izquierdo en desktop */}
      <style>{`
        @media (min-width: 900px) {
          .login-left-panel { display: block !important; }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #1a1a1a inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      `}</style>
    </div>
  )
}
