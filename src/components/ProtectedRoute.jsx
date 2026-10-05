import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Protege una ruta: exige sesión y, opcionalmente, un permiso según el rol.
export default function ProtectedRoute({ children, permiso }) {
  const { usuario, can } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />
  if (permiso && !can(permiso)) return <Navigate to="/" replace />
  return children
}
