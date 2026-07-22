import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center text-stone">Loading…</div>
  }

  if (!session) {
    return <Navigate to="/admin-login" replace />
  }

  return children
}
