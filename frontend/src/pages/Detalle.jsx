import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motosApi } from '../services/api'
import { getColors } from '../data/motoColors'
import { getSpecs } from '../data/motoSpecs'

export default function Detalle() {
  const { pk } = useParams()
  const [moto, setMoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeColor, setActiveColor] = useState(0)

  useEffect(() => {
    motosApi.get(pk).then(data => {
      setMoto(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [pk])

  if (loading) return (
    <section className="detail-section">
      <div className="container-main">
        <div className="detail-skeleton" />
      </div>
    </section>
  )

  if (!moto) return (
    <section className="detail-section">
      <div className="container-main">
        <div className="empty-state">
          <h3>Moto no encontrada</h3>
          <Link to="/motos" className="btn-primary-yamaha">Ver catálogo</Link>
        </div>
      </div>
    </section>
  )

  const colors = getColors(moto.modelo)
  const specs = getSpecs(moto.modelo)
  const imgSrc = colors ? colors[activeColor].image : moto.imagen

  return (
    <section className="detail-section">
      <div className="container-main">
        <Link to="/motos" className="detail-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver al catálogo
        </Link>

        <div className="detail-card">
          <div className="detail-layout">
            {/* Imagen */}
            <div className="detail-image-side">
              <div className="detail-img-wrapper">
                {imgSrc ? (
                  <img src={imgSrc} alt={moto.modelo} className="detail-main-img" />
                ) : (
                  <div className="moto-no-image" style={{ height: 300 }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                  </div>
                )}
              </div>
              {colors && (
                <div style={{ textAlign: 'center' }}>
                  {colors.length > 1 && (
                    <div className="color-dots" style={{ justifyContent: 'center', marginBottom: 8 }}>
                      {colors.map((c, i) => (
                        <button
                          key={i}
                          className={`color-dot${activeColor === i ? ' active' : ''}`}
                          style={{ background: c.hex, border: activeColor === i ? '2px solid #333' : '2px solid rgba(0,0,0,0.15)' }}
                          title={c.label}
                          onClick={() => setActiveColor(i)}
                        />
                      ))}
                    </div>
                  )}
                  <p style={{ fontSize: 13, color: '#555', margin: 0, fontWeight: 500 }}>
                    {colors[activeColor].label}
                  </p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="detail-info-side">
              <span className="detail-category">{moto.categoria_display}</span>
              <h1 className="detail-name">{moto.modelo}</h1>

              <div style={{ marginBottom: 16 }}>
                {moto.stock > 0 ? (
                  <span className="status-available">Disponible ({moto.stock} en stock)</span>
                ) : (
                  <span className="status-unavailable">Agotado</span>
                )}
              </div>

              {specs && (
                <p style={{ color: '#555', fontSize: 15, marginBottom: 20, lineHeight: 1.6 }}>
                  {specs.desc}
                </p>
              )}

              <div className="detail-price">
                {moto.precio_formateado}
                <div style={{ fontSize: 14, color: '#888', marginTop: 4, fontWeight: 'normal' }}>IVA del 19% incluido</div>
              </div>

              <div className="detail-specs">
                <div className="detail-spec-row">
                  <span className="detail-spec-label">Año</span>
                  <span className="detail-spec-value">{moto.anio}</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-label">Cilindrada</span>
                  <span className="detail-spec-value">{moto.cilindrada} cc</span>
                </div>
                {specs && (
                  <>
                    <div className="detail-spec-row">
                      <span className="detail-spec-label">Potencia</span>
                      <span className="detail-spec-value">{specs.hp} HP</span>
                    </div>
                    <div className="detail-spec-row">
                      <span className="detail-spec-label">Torque</span>
                      <span className="detail-spec-value">{specs.nm} Nm</span>
                    </div>
                  </>
                )}
                <div className="detail-spec-row">
                  <span className="detail-spec-label">Color</span>
                  <span className="detail-spec-value">{colors ? colors[activeColor].label : moto.color}</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-label">Categoría</span>
                  <span className="detail-spec-value">{moto.categoria_display}</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-label">Stock</span>
                  <span className="detail-spec-value">{moto.stock} unidades</span>
                </div>
              </div>

              <div className="detail-actions">
                <Link to={`/citas/agendar?moto=${moto.id}`} className="btn-primary-yamaha">
                  Agendar Cita
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M8 3l5 5-5 5"/></svg>
                </Link>
                <Link to={`/checkout?moto=${moto.id}`} className="btn-primary-yamaha">
                  Comprar Ahora
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M8 3l5 5-5 5"/></svg>
                </Link>
                <a
                  href={`https://wa.me/593123456789?text=Hola%2C%20me%20interesa%20la%20${encodeURIComponent(moto.modelo)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.855L.054 23.27a.75.75 0 0 0 .926.926l5.415-1.479A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.528-5.215-1.444l-.374-.222-3.878 1.058 1.058-3.878-.222-.374A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  Cotizar por WhatsApp
                </a>
                <Link to="/motos" className="btn-outline-yamaha">
                  Ver más motos
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M8 3l5 5-5 5"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
