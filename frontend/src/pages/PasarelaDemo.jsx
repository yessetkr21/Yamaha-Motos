import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function PasarelaDemo() {
  const [params] = useSearchParams()

  const pagoId = params.get('pago_id')
  const gateway = params.get('gateway') || 'mercadopago'
  const externalReference = params.get('external_reference') || ''
  const amount = params.get('amount') || ''

  const amountText = useMemo(() => {
    if (!amount) return '-'
    const number = Number(amount)
    if (Number.isNaN(number)) return amount
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(number)
  }, [amount])

  const sendResult = (status) => {
    if (!pagoId) return

    const query = new URLSearchParams({
      pago_id: String(pagoId),
      status,
      gateway,
      external_reference: externalReference,
      payment_id: `demo_pay_${Date.now()}`,
      status_detail: status === 'approved'
        ? 'accredited'
        : status === 'pending'
          ? 'pending_contingency'
          : 'cc_rejected_other_reason',
    })

    window.location.href = `/pago/resultado?${query.toString()}`
  }

  return (
    <section className="premium-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-main" style={{ maxWidth: 700 }}>
        <div className="login-card" style={{ maxWidth: '100%' }}>
          <div className="login-card-header">
            <div className="login-brand">Pasarela de Pago Demo</div>
            <h1 className="login-title" style={{ marginTop: 8 }}>Mercado Pago (Simulado)</h1>
            <p className="login-subtitle">Esta pantalla simula el checkout externo para pruebas academicas.</p>
          </div>

          <div className="login-card-body">
            {!pagoId ? (
              <div className="login-alert-error">No se encontró un pago para procesar.</div>
            ) : (
              <>
                <div className="cita-info-card" style={{ marginBottom: 16 }}>
                  <p><strong>Pago ID:</strong> {pagoId}</p>
                  <p><strong>Referencia:</strong> {externalReference || '-'}</p>
                  <p><strong>Monto:</strong> {amountText}</p>
                </div>

                <div style={{ display: 'grid', gap: 10 }}>
                  <button className="cita-submit-btn" onClick={() => sendResult('approved')}>
                    Aprobar pago
                  </button>
                  <button className="btn-outline-yamaha" onClick={() => sendResult('pending')}>
                    Dejar pendiente
                  </button>
                  <button className="btn-outline-yamaha" style={{ borderColor: '#cc0000', color: '#cc0000' }} onClick={() => sendResult('rejected')}>
                    Rechazar pago
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
