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
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M8 3l5 5-5 5"/></svg>
              </Link>
              <a
                href={`https://wa.me/593123456789?text=Hola%2C%20me%20interesa%20la%20NMAX%20155`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.855L.054 23.27a.75.75 0 0 0 .926.926l5.415-1.479A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.528-5.215-1.444l-.374-.222-3.878 1.058 1.058-3.878-.222-.374A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
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
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M8 3l5 5-5 5"/></svg>
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
        <div className="reviews-header">
          <h2 className="reviews-heading-dark">
            <span>Lo que dicen</span>
            <span>nuestros clientes.</span>
          </h2>
        </div>

        <div className="reviews-marquee-outer">
          <div className="reviews-marquee-track">
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-stars-top">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="star-icon" viewBox="0 0 24 24" fill="#F59E0B">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="review-text">{r.text}</p>
                <div className="review-author">
                  <div className="review-avatar" style={{ background: r.color }}>{r.initial}</div>
                  <span className="review-name">{r.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
