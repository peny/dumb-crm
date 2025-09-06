import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth()

  // SIMPLIFIED FOR DEBUGGING - NO AUTH CHECK
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Debug Mode</h1>
        <p className="text-gray-600 mb-4">Auth check disabled to debug infinite loop.</p>
        
        {/* Debug Info */}
        <div className="bg-gray-100 p-4 rounded mb-4 text-left text-sm">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
          <p><strong>Current URL:</strong> {window.location.href}</p>
          <p><strong>Cookies:</strong> {document.cookie || 'No cookies'}</p>
        </div>
        
        <button 
          onClick={() => window.location.href = '/login'}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login (Manual)
        </button>
      </div>
    </div>
  )
}

export default ProtectedRoute
