import * as SecureStore from 'expo-secure-store'
import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../services/apiService'

const TOKEN_KEY = 'cashi_token'

interface AuthContextType {
  token: string | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadToken = async () => {
      try {
        const saved = await SecureStore.getItemAsync(TOKEN_KEY)
        if (saved) setToken(saved)
      } catch {
      } finally {
        setLoading(false)
      }
    }
    loadToken()
  }, [])

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      await SecureStore.setItemAsync(TOKEN_KEY, data.token)
      setToken(data.token)
    } catch (e: any) {
      setError(e.message)
      throw e
    }
  }

  const register = async (email: string, password: string) => {
    setError(null)
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: { email, password },
      })
      await SecureStore.setItemAsync(TOKEN_KEY, data.token)
      setToken(data.token)
    } catch (e: any) {
      setError(e.message)
      throw e
    }
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}