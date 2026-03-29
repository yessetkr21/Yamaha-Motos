import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motosApi } from '../services/api'
import MotoCard from '../components/MotoCard'

const CATEGORIAS = [
  ['scooter', 'Scooter'],
  ['sport', 'Sport'],
  ['naked', 'Naked'],
  ['adventure', 'Adventure'],
  ['touring', 'Touring'],
]

export default function Lista() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoriaActual = searchParams.get('categoria') || ''
  const query = searchParams.get('q') || ''

  const [motos, setMotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(query)

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (categoriaActual) params.categoria = categoriaActual
    if (query) params.q = query
    motosApi.list(params).then(data => {
      setMotos(data.results || data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [categoriaActual, query])

  const handleSearch = (e) => {
    e.preventDefault()
    const p = {}
    if (search.trim()) p.q = search.trim()
    if (categoriaActual) p.categoria = categoriaActual
    setSearchParams(p)
  }

  const setCategoria = (cat) => {
    const p = {}
    if (cat) p.categoria = cat
    if (query) p.q = query
    setSearchParams(p)
  }

  return (
    <section className="catalog-section">
      <div className="container-main">
        <Link to="/" className="detail-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver al inicio
        </Link>

        <h1 className="catalog-title">Nuestras Motos</h1>
        <p className="catalog-subtitle">Explora nuestra selección de motocicletas Yamaha</p>

        {/* Búsqueda */}
        <form className="catalog-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar modelo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="catalog-search-input"
          />
          <button type="submit" className="catalog-search-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </form>

        {/* Filtros */}
        <div className="filter-tabs">
          <button
            className={`filter-tab${!categoriaActual ? ' active' : ''}`}
            onClick={() => setCategoria('')}
          >
            Todas
          </button>
          {CATEGORIAS.map(([cod, nom]) => (
            <button
              key={cod}
              className={`filter-tab${categoriaActual === cod ? ' active' : ''}`}
              onClick={() => setCategoria(cod)}
            >
              {nom}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="catalog-grid">
            {[...Array(8)].map((_, i) => <div key={i} className="card-skeleton" />)}
          </div>
        ) : motos.length > 0 ? (
          <div className="catalog-grid">
            {motos.map(m => <MotoCard key={m.id} moto={m} />)}
          </div>
        ) : (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <h3>No se encontraron motos</h3>
            <p>No hay motos disponibles con ese filtro.</p>
            <button className="btn-outline-yamaha" onClick={() => { setSearch(''); setSearchParams({}) }}>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
