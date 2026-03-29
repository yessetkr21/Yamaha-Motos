import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-main">
        <div className="footer-grid">
          <div className="footer-col">
            <h4 className="footer-heading">Yamaha Motos</h4>
            <p className="footer-text">Distribuidor oficial de motocicletas Yamaha. Más de 30 años de experiencia brindando calidad y confianza.</p>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Navegación</h4>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/motos">Catálogo</Link></li>
              <li><a href="/#servicios">Servicios</a></li>
              <li><a href="/#opiniones">Opiniones</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Categorías</h4>
            <ul className="footer-links">
              <li><Link to="/motos?categoria=scooter">Scooter</Link></li>
              <li><Link to="/motos?categoria=sport">Sport</Link></li>
              <li><Link to="/motos?categoria=naked">Naked</Link></li>
              <li><Link to="/motos?categoria=adventure">Adventure</Link></li>
              <li><Link to="/motos?categoria=touring">Touring</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Contacto</h4>
            <ul className="footer-contact">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                +593 123 456 789
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                info@yamaha.com
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Guayaquil, Ecuador
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Yamaha Motos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
