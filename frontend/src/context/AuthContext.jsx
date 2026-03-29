import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [cliente, setCliente] = useState(() => {
    try {
      const stored = localStorage.getItem('yamaha_cliente')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (clienteData) => {
    setCliente(clienteData)
    localStorage.setItem('yamaha_cliente', JSON.stringify(clienteData))
  }

  const logout = () => {
    setCliente(null)
    localStorage.removeItem('yamaha_cliente')
  }

  return (
    <AuthContext.Provider value={{ cliente, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
