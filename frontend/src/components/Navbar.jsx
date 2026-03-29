import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Bike, Calendar, LogIn, CalendarCheck, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const RED = '#E60012'

export default function Navbar() {
  const { cliente, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const items = [
    { name: 'Inicio',        url: '/',               icon: Home },
    { name: 'Motos',         url: '/motos',          icon: Bike },
    { name: 'Agendar Cita',  url: '/citas/agendar',  icon: Calendar },
    ...(cliente
      ? [
          { name: 'Mis Citas',      url: '/mis-citas', icon: CalendarCheck },
          { name: 'Cerrar Sesión',  url: null,         icon: LogOut, action: handleLogout },
        ]
      : [{ name: 'Iniciar Sesión', url: '/login', icon: LogIn }]
    ),
  ]

  const activeItem = items.find(item =>
    item.url === location.pathname ||
    (item.url !== '/' && location.pathname.startsWith(item.url))
  )?.name ?? items[0].name

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        paddingTop: 20,
        width: 'max-content',
        maxWidth: '95vw',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'rgba(10,10,10,0.55)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          padding: '4px 6px',
          borderRadius: 9999,
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.name

          const inner = (
            <>
              {/* Label desktop / icon mobile */}
              {isMobile
                ? <Icon size={18} strokeWidth={2.5} />
                : <span style={{ position: 'relative', zIndex: 1 }}>{item.name}</span>
              }

              {/* Tube-light effect */}
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(230,0,18,0.08)',
                    borderRadius: 9999,
                    zIndex: 0,
                  }}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                >
                  {/* Bar + glow at top */}
                  <div style={{
                    position: 'absolute',
                    top: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 32,
                    height: 4,
                    background: RED,
                    borderRadius: '0 0 4px 4px',
                  }}>
                    {/* outer glow */}
                    <div style={{
                      position: 'absolute',
                      width: 56,
                      height: 20,
                      background: 'rgba(230,0,18,0.25)',
                      borderRadius: '50%',
                      filter: 'blur(8px)',
                      top: -4,
                      left: -12,
                    }} />
                    {/* inner glow */}
                    <div style={{
                      position: 'absolute',
                      width: 32,
                      height: 14,
                      background: 'rgba(230,0,18,0.35)',
                      borderRadius: '50%',
                      filter: 'blur(5px)',
                      top: -2,
                      left: 0,
                    }} />
                    {/* core */}
                    <div style={{
                      position: 'absolute',
                      width: 16,
                      height: 8,
                      background: 'rgba(255,80,80,0.5)',
                      borderRadius: '50%',
                      filter: 'blur(3px)',
                      top: 0,
                      left: 8,
                    }} />
                  </div>
                </motion.div>
              )}
            </>
          )

          const sharedStyle = {
            position: 'relative',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            padding: isMobile ? '8px 12px' : '8px 20px',
            borderRadius: 9999,
            border: 'none',
            background: 'none',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
            transition: 'color 0.2s',
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            fontFamily: 'inherit',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
          }

          if (item.action) {
            return (
              <button key={item.name} onClick={item.action} style={sharedStyle}>
                {inner}
              </button>
            )
          }

          return (
            <Link key={item.name} to={item.url} style={sharedStyle}>
              {inner}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
