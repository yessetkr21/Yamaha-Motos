import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, FileText, Mail, Phone, MapPin, Building2,
  ArrowRight, AlertCircle, CheckCircle2, Home,
} from 'lucide-react'
import { clientesApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const FIELD_META = {
  nombre:           { icon: User,      label: 'Nombre completo',       placeholder: 'Ej: Juan Pérez',          type: 'text',  required: true },
  numero_documento: { icon: FileText,  label: 'Número de documento',   placeholder: 'Ej: 1234567890',          type: 'text',  required: true },
  email:            { icon: Mail,      label: 'Correo electrónico',    placeholder: 'correo@ejemplo.com',       type: 'email', required: true },
  telefono:         { icon: Phone,     label: 'Teléfono',              placeholder: '+57 300 123 4567',         type: 'tel',   required: true },
  ciudad:           { icon: Building2, label: 'Ciudad',                placeholder: 'Ej: Bogotá',              type: 'text',  required: false },
  departamento:     { icon: MapPin,    label: 'Departamento',          placeholder: 'Ej: Cundinamarca',         type: 'text',  required: false },
  direccion:        { icon: Home,      label: 'Dirección',             placeholder: 'Carrera 7 #45-67',         type: 'text',  required: false },
}

const STEPS = [
  { title: 'Datos personales',  fields: ['nombre', 'numero_documento', 'email', 'telefono'] },
  { title: 'Ubicación',         fields: ['ciudad', 'departamento', 'direccion'] },
]

export default function Registro() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/'

  const [form, setForm] = useState({
    nombre: '', email: '', telefono: '', numero_documento: '',
    ciudad: '', departamento: '', direccion: '',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)
  const [step, setStep]       = useState(0)

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const currentFields = STEPS[step].fields

  const canAdvance = () =>
    STEPS[step].fields.every((f) => !FIELD_META[f].required || form[f].trim() !== '')

  const handleNext = (e) => {
    e.preventDefault()
    if (step < STEPS.length - 1) { setStep(step + 1); return }
    handleSubmit()
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await clientesApi.create(form)
      login(data)
      navigate(next)
    } catch (err) {
      setError(err.message || 'Error al registrar. Verifica los datos.')
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

      {/* Panel izquierdo — solo desktop */}
      <div style={{ display: 'none', flex: '0 0 48%', position: 'relative', overflow: 'hidden' }}
        className="login-left-panel"
      >
        <img
          src="/static/images/iniciarsesionfoto.jpg"
          alt="Yamaha"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(230,0,18,0.3) 0%, rgba(0,0,0,0.75) 100%)',
        }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '48px 52px' }}>
          <div style={{ width: 40, height: 3, background: '#E60012', marginBottom: 20 }} />
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Únete a la<br />familia<br />Yamaha.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.65, maxWidth: 340 }}>
            Crea tu cuenta en segundos y accede a citas, pedidos y el catálogo completo de motos.
          </p>
          {/* Bullets */}
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Agenda citas en el concesionario', 'Sigue el estado de tus pedidos', 'Proceso de compra seguro'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={16} color="#E60012" />
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Glow fondo */}
      <div style={{
        position: 'absolute',
        top: '15%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 700, height: 700,
        background: 'radial-gradient(circle, rgba(230,0,18,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Panel derecho — formulario */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', position: 'relative', zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: 440 }}
        >

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 600 }}>Crear cuenta</span>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '8px 0 8px' }}>
              Empieza tu<br />aventura hoy
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
              Paso {step + 1} de {STEPS.length} — {STEPS[step].title}
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, marginBottom: 32, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ height: '100%', background: '#E60012', borderRadius: 99 }}
            />
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
                  background: 'rgba(230,0,18,0.1)', border: '1px solid rgba(230,0,18,0.28)',
                  borderRadius: 12, padding: '12px 14px', marginBottom: 20,
                  color: '#ff6b6b', fontSize: 13, lineHeight: 1.4,
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                {currentFields.map((field) => {
                  const meta = FIELD_META[field]
                  const Icon = meta.icon
                  const isFocused = focused === field
                  return (
                    <div key={field}>
                      <label style={{
                        display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: 12,
                        fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8,
                      }}>
                        {meta.label}
                        {!meta.required && (
                          <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 6 }}>
                            (opcional)
                          </span>
                        )}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Icon
                          size={15}
                          style={{
                            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                            color: isFocused ? '#E60012' : 'rgba(255,255,255,0.25)',
                            transition: 'color 0.2s', pointerEvents: 'none',
                          }}
                        />
                        <input
                          type={meta.type}
                          required={meta.required}
                          placeholder={meta.placeholder}
                          value={form[field]}
                          onChange={set(field)}
                          onFocus={() => setFocused(field)}
                          onBlur={() => setFocused(null)}
                          style={{
                            width: '100%',
                            background: isFocused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                            border: `1.5px solid ${isFocused ? '#E60012' : 'rgba(255,255,255,0.09)'}`,
                            borderRadius: 12,
                            padding: '13px 14px 13px 40px',
                            color: '#fff',
                            fontSize: 14,
                            outline: 'none',
                            transition: 'all 0.2s',
                            boxSizing: 'border-box',
                            boxShadow: isFocused ? '0 0 0 3px rgba(230,0,18,0.1)' : 'none',
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </AnimatePresence>

            {/* Botones navegación */}
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  style={{
                    flex: '0 0 auto',
                    padding: '13px 20px',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.6)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                >
                  Atrás
                </button>
              )}
              <motion.button
                type="submit"
                disabled={loading || !canAdvance()}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: (loading || !canAdvance()) ? 'rgba(230,0,18,0.35)' : '#E60012',
                  color: '#fff', border: 'none', borderRadius: 12,
                  padding: '14px 24px', fontSize: 14, fontWeight: 700,
                  cursor: (loading || !canAdvance()) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s, box-shadow 0.2s',
                  boxShadow: (loading || !canAdvance()) ? 'none' : '0 4px 20px rgba(230,0,18,0.3)',
                  fontFamily: 'inherit', letterSpacing: '-0.01em',
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                    />
                    Creando cuenta...
                  </>
                ) : step < STEPS.length - 1 ? (
                  <>Continuar <ArrowRight size={16} /></>
                ) : (
                  <>Crear mi cuenta <ArrowRight size={16} /></>
                )}
              </motion.button>
            </div>
          </form>

          {/* Link login */}
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>¿Ya tienes cuenta?</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>
            <Link
              to={`/login${next !== '/' ? '?next=' + next : ''}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: '#fff', fontSize: 14, fontWeight: 600,
                padding: '12px 28px', borderRadius: 12,
                border: '1.5px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                textDecoration: 'none', transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            >
              Iniciar sesión
            </Link>
          </div>

        </motion.div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .login-left-panel { display: block !important; }
        }
        input::placeholder { color: rgba(255,255,255,0.18); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #1a1a1a inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      `}</style>
    </div>
  )
}
