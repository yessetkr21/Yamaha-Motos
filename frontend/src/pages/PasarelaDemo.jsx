import { useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}

export default function PasarelaDemo() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const pagoId          = params.get('pago_id')
  const gateway         = params.get('gateway') || 'mercadopago'
  const externalRef     = params.get('external_reference') || ''
  const amount          = params.get('amount') || ''

  const [form, setForm] = useState({ nombre: '', cedula: '', numero: '', expiry: '', cvv: '' })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const amountText = useMemo(() => {
    const n = Number(amount)
    if (!amount || Number.isNaN(n)) return ''
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
  }, [amount])

  const set = (field) => (e) => {
    let val = e.target.value
    if (field === 'numero') val = formatCardNumber(val)
    if (field === 'expiry') val = formatExpiry(val)
    if (field === 'cvv')    val = val.replace(/\D/g, '').slice(0, 4)
    if (field === 'cedula') val = val.replace(/\D/g, '').slice(0, 12)
    setForm(prev => ({ ...prev, [field]: val }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
      if (pagoId) {
        const query = new URLSearchParams({
          pago_id: String(pagoId),
          status: 'approved',
          gateway,
          external_reference: externalRef,
          payment_id: `card_pay_${Date.now()}`,
          status_detail: 'accredited',
        })
        // Actualizar estado en backend silenciosamente
        fetch('/api/v1/pagos/confirmar-retorno/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pago_id: Number(pagoId),
            status: 'approved',
            gateway,
            external_reference: externalRef,
            payment_id: `card_pay_${Date.now()}`,
            status_detail: 'accredited',
          }),
        }).catch(() => {})
      }
    }, 1400)
  }

  if (done) {
    return (
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: 420 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: '#16a34a',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111', marginBottom: 10, letterSpacing: '-0.02em' }}>
            ¡Compra exitosa!
          </h2>
          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: 32, lineHeight: 1.6 }}>
            Tu pago fue procesado correctamente.{amountText && <> Monto: <strong>{amountText}</strong></>}
          </p>
          <button
            className="cita-submit-btn"
            style={{ maxWidth: 260, margin: '0 auto' }}
            onClick={() => navigate('/mis-pedidos')}
          >
            Ver mis pedidos
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M8 3l5 5-5 5"/></svg>
          </button>
        </div>
      </section>
    )
  }

  return (
    <section style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>

        {/* Header */}
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111', letterSpacing: '-0.01em' }}>Pago con tarjeta</span>
          </div>
          {amountText && (
            <p style={{ color: '#555', fontSize: '0.875rem' }}>Total a pagar: <strong style={{ color: '#111' }}>{amountText}</strong></p>
          )}
        </div>

        {/* Card */}
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '32px 28px' }}>
          <form onSubmit={handleSubmit}>

            {/* Nombre */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Nombre en la tarjeta</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Juan Pérez"
                value={form.nombre}
                onChange={set('nombre')}
                required
              />
            </div>

            {/* Cédula */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Número de cédula</label>
              <input
                style={inputStyle}
                type="text"
                inputMode="numeric"
                placeholder="1234567890"
                value={form.cedula}
                onChange={set('cedula')}
                required
              />
            </div>

            {/* Número tarjeta */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Número de tarjeta</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{ ...inputStyle, paddingRight: 48 }}
                  type="text"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  value={form.numero}
                  onChange={set('numero')}
                  required
                />
                <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }}
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5">
                  <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
            </div>

            {/* Fecha + CVV */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
              <div>
                <label style={labelStyle}>Fecha de expiración</label>
                <input
                  style={inputStyle}
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/AA"
                  value={form.expiry}
                  onChange={set('expiry')}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>CVV</label>
                <input
                  style={inputStyle}
                  type="text"
                  inputMode="numeric"
                  placeholder="123"
                  value={form.cvv}
                  onChange={set('cvv')}
                  required
                />
              </div>
            </div>

            <button type="submit" className="cita-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  Pagar{amountText ? ` ${amountText}` : ''}
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M8 3l5 5-5 5"/></svg>
                </>
              )}
            </button>

          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.78rem', color: '#aaa' }}>
          Entorno de pruebas · Los datos no son procesados realmente
        </p>
      </div>
    </section>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#444',
  marginBottom: 6,
  letterSpacing: '0.01em',
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #d4d4d4',
  borderRadius: 6,
  fontSize: '0.9rem',
  color: '#111',
  outline: 'none',
  fontFamily: 'inherit',
  background: '#fafafa',
  transition: 'border-color 0.15s',
}
