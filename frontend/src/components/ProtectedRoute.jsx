import { useAuth } from '../contexts/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth()
  const location = useLocation()
  const [redirectCount, setRedirectCount] = useState(0)

  // Prevent infinite redirects
  useEffect(() => {
    if (!isAuthenticated && !loading && location.pathname !== '/login') {
      setRedirectCount(prev => prev + 1)
      if (redirectCount > 3) {
        console.error('Infinite redirect detected, clearing auth state')
        window.location.href = '/login'
      }
    }
  }, [isAuthenticated, loading, location.pathname, redirectCount])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
