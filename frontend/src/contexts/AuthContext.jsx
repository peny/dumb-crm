import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI, clearAllCache } from '../api/client'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const navigate = useNavigate()

  // Check if user is authenticated on app load (only once)
  useEffect(() => {
    if (!authChecked) {
      checkAuth()
    }
  }, [authChecked])

  const checkAuth = async () => {
    if (authChecked) {
      console.log('AuthContext: Auth already checked, skipping')
      return
    }
    
    try {
      console.log('AuthContext: Starting auth check...')
      const response = await authAPI.me()
      console.log('AuthContext: Auth check response:', response)
      if (response.success) {
        console.log('AuthContext: Authentication successful, setting user')
        setUser(response.data)
        setIsAuthenticated(true)
      } else {
        console.log('AuthContext: Auth check failed:', response.error)
        clearAuthState()
      }
    } catch (error) {
      console.error('AuthContext: Auth check failed with error:', error)
      console.error('AuthContext: Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
      // Only clear auth state if it's a 401 error, not other network errors
      if (error.response?.status === 401 || error.status === 401) {
        console.log('AuthContext: 401 error, clearing auth state')
        clearAuthState()
      } else {
        console.log('AuthContext: Non-401 error, just setting loading to false')
        // For other errors, just set loading to false without clearing auth
        setLoading(false)
      }
    } finally {
      setLoading(false)
      setAuthChecked(true)
    }
  }

  const clearAuthState = () => {
    setUser(null)
    setIsAuthenticated(false)
    setLoading(false)
    // Clear all cached data
    clearAllCache()
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      console.log('Login response:', response)
      if (response.success) {
        setUser(response.data.user)
        setIsAuthenticated(true)
        return { success: true }
      }
      return { success: false, error: response.error }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: 'Login failed' }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      // Clear all authentication state
      clearAuthState()
      
      // Clear all cached data
      clearAllCache()
      
      // Clear any cached data by reloading the page
      // This ensures all components reset their state
      window.location.href = '/login'
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword(currentPassword, newPassword)
      if (response.success) {
        return { success: true }
      }
      return { success: false, error: response.error }
    } catch (error) {
      console.error('Password change failed:', error)
      return { success: false, error: 'Password change failed' }
    }
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    changePassword,
    isAdmin,
    checkAuth,
    clearAuthState
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
