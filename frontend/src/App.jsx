import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFAB from './components/WhatsAppFAB'
import Home from './pages/Home'
import Lista from './pages/Lista'
import Detalle from './pages/Detalle'
import Login from './pages/Login'
import Registro from './pages/Registro'
import AgendarCita from './pages/AgendarCita'
import MisCitas from './pages/MisCitas'
import CheckoutPedido from './pages/CheckoutPedido'
import MisPedidos from './pages/MisPedidos'
import PagoResultado from './pages/PagoResultado'
import PasarelaDemo from './pages/PasarelaDemo'

function NotFound() {
  return (
    <div className="empty-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
      <h3 style={{ marginTop: 16 }}>Página no encontrada</h3>
      <a href="/" className="btn-primary-yamaha" style={{ marginTop: 16 }}>Volver al inicio</a>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/motos" element={<Lista />} />
            <Route path="/motos/:pk" element={<Detalle />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/citas/agendar" element={<AgendarCita />} />
            <Route path="/mis-citas" element={<MisCitas />} />
            <Route path="/checkout" element={<CheckoutPedido />} />
            <Route path="/mis-pedidos" element={<MisPedidos />} />
            <Route path="/pago/resultado" element={<PagoResultado />} />
            <Route path="/pasarela-demo" element={<PasarelaDemo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppFAB />
      </AuthProvider>
    </BrowserRouter>
  )
}
