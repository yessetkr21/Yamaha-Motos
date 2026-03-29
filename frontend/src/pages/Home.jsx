import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motosApi } from '../services/api'
import MotoCard from '../components/MotoCard'
import { getColors } from '../data/motoColors'

const REVIEWS = [
  { text: 'Servicio completo, encontrarás motocicletas, repuestos, accesorios y servicio mecánico para tu vehículo', author: 'Luis Carlos Cordero', initial: 'L', color: '#8B6914' },
  { text: 'Excelente atención. Muy amables', author: 'Luis Carlos Cordero', initial: 'L', color: '#795548' },
  { text: 'Excelente atención, te dan la información de manera adecuada y acertiva', author: 'Carlos Mendez', initial: 'C', color: '#607D8B' },
  { text: 'Excelente precio y servicio', author: 'Luis Carlos Cordero', initial: 'L', color: '#4CAF50' },
  { text: 'Lo mejor de lo mejor, repuestos, motos y buena atención', author: 'Mateo Perdomo', initial: 'M', color: '#FF9800' },
  { text: 'Me gusta que manejen las revisiones con cita, así uno se programa mejor', author: 'Mateo Perdomo', initial: 'M', color: '#3F51B5' },
  { text: 'El servicio es bueno, los empleados son amables, buena experiencia con los mantenimientos', author: 'Adrian Garcia', initial: 'A', color: '#9C27B0' },
  { text: 'Lo mejor de lo mejor, repuestos, motos y buena atención al cliente', author: 'Mateo Perdomo', initial: 'M', color: '#E91E63' },
]

function NmaxShowcase({ motos }) {
  const nmax = motos.find(m => m.modelo === 'NMAX 155')
  const colors = getColors('NMAX 155')
  const [active, setActive] = useState(0)
  if (!nmax || !colors) return null

  return (
    <section className="section-showcase" id="nmax-showcase">
      <div className="container-main">
        <div className="showcase-wrapper">
          <div className="showcase-image-side">
            <div className="showcase-badge">Nuevo 2026</div>
            <div className="showcase-image-box">
              <img
                src={colors[active].image}
                alt={`NMAX ${colors[active].label}`}
                className="showcase-moto-img"
                style={{ transition: 'opacity 0.35s' }}
              />
            </div>
            <div className="showcase-colors">
              <span className="showcase-color-label">
                Color: <strong>{colors[active].label}</strong>
              </span>
              <div className="showcase-color-circles">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    className={`color-circle-lg${active === i ? ' active' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                    onClick={() => setActive(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="showcase-info-side">
            <span className="showcase-category">Scooter Premium</span>
            <h2 className="showcase-title">YAMAHA NMAX 155</h2>
            <p className="showcase-desc">
              Elegancia urbana con tecnología de punta. Motor Blue Core de 155cc,
              sistema ABS, conectividad Y-Connect y el máximo confort para tu día a día.
            </p>
            <div className="showcase-specs">
              <div className="showcase-spec">
                <span className="showcase-spec-val">15,15</span>
                <span className="showcase-spec-unit">HP</span>
                <span className="showcase-spec-name">Potencia</span>
              </div>
              <div className="showcase-spec">
                <span className="showcase-spec-val">14,2</span>
                <span className="showcase-spec-unit">Nm</span>
                <span className="showcase-spec-name">Torque</span>
              </div>
              <div className="showcase-spec">
                <span className="showcase-spec-val">155</span>
                <span className="showcase-spec-unit">cc</span>
                <span className="showcase-spec-name">Cilindraje</span>
              </div>
              <div className="showcase-spec">
                <span className="showcase-spec-val">ABS</span>
                <span className="showcase-spec-unit">&nbsp;</span>
                <span className="showcase-spec-name">Frenos</span>
              </div>
            </div>
            <div className="showcase-price-box">
              <span className="showcase-price-label">Desde</span>
              <span className="showcase-price">{nmax.precio_formateado}</span>
              <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>IVA del 19% incluido</div>
            </div>
            <div className="showcase-actions">
              <Link to="/motos" className="btn-primary-yamaha">
                Ver más detalles
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a
                href={`https://wa.me/593123456789?text=Hola%2C%20me%20interesa%20la%20NMAX%20155`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp-sm"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                Cotizar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [motos, setMotos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    motosApi.list().then(data => {
      setMotos(data.results || data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const destacadas = motos.slice(0, 6)

  return (
    <>
      {/* Hero Video — arranca desde el top real, el navbar flotante lo cubre */}
      <section className="hero-video-section">
        {/* Video de fondo */}
        <video
          className="hero-video-bg"
          src="/static/images/videoprom.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Capas de overlay */}
        <div className="hero-video-overlay" />
        <div className="hero-video-vignette" />

        {/* Contenido */}
        <div className="hero-video-inner">

          {/* Eyebrow label */}
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-bar" />
            <span className="hero-eyebrow-text">Distribuidor Oficial Yamaha</span>
            <span className="hero-eyebrow-bar" />
          </div>

          {/* Título con reveal por línea */}
          <h1 className="hero-video-title">
            <span className="hero-reveal-line">
              <span className="hero-reveal-inner">Encuentra tu</span>
            </span>
            <span className="hero-reveal-line hero-reveal-line--delay">
              <span className="hero-reveal-inner hero-accent-word">moto ideal</span>
            </span>
          </h1>

          {/* Divider */}
          <div className="hero-divider-line" />

          <div className="hero-video-buttons">
            <Link to="/motos" className="hero-btn-primary">
              Ver Catálogo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/citas/agendar" className="hero-btn-secondary">
              Agendar Cita
            </Link>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-hint">
          <div className="hero-scroll-mouse">
            <div className="hero-scroll-wheel" />
          </div>
          <span>Scroll</span>
        </div>
      </section>

      {/* Modelos Destacados */}
      <section className="section-featured" id="modelos">
        <div className="container-main">
          <div className="section-header-row">
            <h2 className="section-heading"><em>Modelos destacados</em></h2>
            <Link to="/motos" className="btn-outline-yamaha">Ver todos</Link>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="card-skeleton" />)}
            </div>
          ) : (
            <div className="featured-scroll-wrapper">
              <div className="featured-grid">
                {destacadas.map(m => <MotoCard key={m.id} moto={m} />)}
              </div>
              <button
                className="scroll-arrow scroll-arrow-right"
                onClick={() => document.querySelector('.featured-grid').scrollBy({ left: 340, behavior: 'smooth' })}
                aria-label="Siguiente"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* NMAX Showcase */}
      {!loading && <NmaxShowcase motos={motos} />}

      {/* Servicios */}
      <section id="servicios" style={{ background: '#111', padding: '0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>

          {/* Tarjeta 1 — Repuestos */}
          <div style={{ position: 'relative', flex: '1 1 50%', minHeight: 480, overflow: 'hidden' }}>
            <img
              src="/static/images/repuestos.jpg"
              alt="Venta de repuestos y accesorios"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.1) 100%)',
            }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 40px 44px' }}>
              <div style={{ width: 36, height: 3, background: '#E60012', marginBottom: 16 }} />
              <h3 style={{ color: '#fff', fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 12, letterSpacing: '-0.01em' }}>
                Venta de repuestos<br />y accesorios
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(0.85rem, 1.2vw, 0.97rem)', lineHeight: 1.65, maxWidth: 420 }}>
                Equipa tu Yamaha con accesorios originales y repuestos de calidad. Gana estilo, seguridad y confianza en cada trayecto.
              </p>
            </div>
          </div>

          {/* Tarjeta 2 — Servicio Técnico */}
          <div style={{ position: 'relative', flex: '1 1 50%', minHeight: 480, overflow: 'hidden' }}>
            <img
              src="/static/images/serviciotecnico.jpg"
              alt="Servicio técnico"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.1) 100%)',
            }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 40px 44px' }}>
              <div style={{ width: 36, height: 3, background: '#E60012', marginBottom: 16 }} />
              <h3 style={{ color: '#fff', fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 12, letterSpacing: '-0.01em' }}>
                Servicio técnico
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(0.85rem, 1.2vw, 0.97rem)', lineHeight: 1.65, maxWidth: 420 }}>
                Mantén tu Yamaha en perfecto estado con respaldo de expertos. Disfruta de un rendimiento óptimo y una moto siempre lista para la aventura.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Opiniones */}
      <section className="section-reviews" id="opiniones">
        <div className="container-main">
          <div className="reviews-header">
            <h2 className="section-heading-lg"><strong>Lo que dicen nuestros clientes</strong></h2>
            <div className="reviews-rating-summary">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="star-icon" viewBox="0 0 24 24" fill="#F59E0B">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <div className="reviews-count">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="google-icon" />
                <span>4.5 de 25 reseñas</span>
              </div>
            </div>
          </div>
          <div className="reviews-grid">
            {REVIEWS.map((r, i) => (
              <div key={i} className="review-card">
                <p className="review-text"><em>{r.text}</em></p>
                <div className="review-author">
                  <div className="review-avatar" style={{ background: r.color }}>{r.initial}</div>
                  <div>
                    <span className="review-name">{r.author}</span>
                    <div className="review-stars-sm">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} className="star-sm" viewBox="0 0 24 24" fill="#F59E0B">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                      <img src="https://www.google.com/favicon.ico" alt="G" className="google-icon-sm" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
