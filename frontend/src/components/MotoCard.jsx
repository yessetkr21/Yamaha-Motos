import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getColors } from '../data/motoColors'
import { getSpecs } from '../data/motoSpecs'

export default function MotoCard({ moto }) {
  const colors = getColors(moto.modelo)
  const specs = getSpecs(moto.modelo)
  const [activeColor, setActiveColor] = useState(colors ? 0 : null)

  const imgSrc = colors
    ? colors[activeColor].image
    : moto.imagen || null

  return (
    <div className="moto-card">
      <div className="moto-card-image">
        <div className="moto-img-container">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={`${moto.modelo} ${colors ? colors[activeColor].label : moto.color}`}
              className="moto-main-img"
            />
          ) : (
            <div className="moto-no-image">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="m21 15-5-5L5 21"/>
              </svg>
            </div>
          )}
        </div>
        {colors && colors.length > 1 && (
          <div className="color-dots">
            {colors.map((c, i) => (
              <button
                key={i}
                className={`color-dot${activeColor === i ? ' active' : ''}`}
                style={{ background: c.hex }}
                title={c.label}
                onClick={(e) => { e.preventDefault(); setActiveColor(i) }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="moto-card-info">
        <div className="moto-card-header">
          <h3 className="moto-name">{moto.modelo.toUpperCase()}</h3>
          <div className="moto-meta">
            <span className="moto-year">Modelo {moto.anio}</span>
            <span className="moto-meta-sep">·</span>
            <span>{colors ? colors[activeColor].label : moto.color}</span>
          </div>
        </div>

        <div className="moto-specs-row">
          {specs && (
            <>
              <div className="spec-item">
                <div className="spec-top">
                  <span className="spec-value">{specs.hp}</span>
                  <span className="spec-unit">HP</span>
                </div>
                <span className="spec-label">Potencia</span>
              </div>
              <div className="spec-divider" />
              <div className="spec-item">
                <div className="spec-top">
                  <span className="spec-value">{specs.nm}</span>
                  <span className="spec-unit">Nm</span>
                </div>
                <span className="spec-label">Torque</span>
              </div>
              <div className="spec-divider" />
            </>
          )}
          <div className="spec-item">
            <div className="spec-top">
              <span className="spec-value">{moto.cilindrada}</span>
              <span className="spec-unit">cc</span>
            </div>
            <span className="spec-label">Cilindraje</span>
          </div>
        </div>

        <div className="moto-price-row">
          <div>
            <span className="price-label">Desde</span>
            <span className="price-value">{moto.precio_formateado}</span>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>IVA del 19% incluido</div>
          </div>
        </div>
      </div>

      <Link to={`/motos/${moto.id}`} className="moto-card-link" aria-label={`Ver detalles de ${moto.modelo}`} />
    </div>
  )
}
