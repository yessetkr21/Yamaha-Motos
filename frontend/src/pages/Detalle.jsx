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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Agendar Cita
                </Link>
                <a
                  href={`https://wa.me/593123456789?text=Hola%2C%20me%20interesa%20la%20${encodeURIComponent(moto.modelo)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp-sm"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  Cotizar por WhatsApp
                </a>
                <Link to="/motos" className="btn-outline-yamaha">Ver más motos</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
