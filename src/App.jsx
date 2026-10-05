import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AppLayout from './components/AppLayout.jsx'
import Login from './pages/Login.jsx'
import Inicio from './pages/Inicio.jsx'
import Candidatos from './pages/Candidatos.jsx'
import CandidatoForm from './pages/CandidatoForm.jsx'
import Solicitudes from './pages/Solicitudes.jsx'
import SolicitudForm from './pages/SolicitudForm.jsx'
import SolicitudDetalle from './pages/SolicitudDetalle.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Inicio />} />
        <Route path="candidatos" element={<Candidatos />} />
        <Route
          path="candidatos/nuevo"
          element={
            <ProtectedRoute permiso="candidatos:escribir">
              <CandidatoForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="candidatos/:id/editar"
          element={
            <ProtectedRoute permiso="candidatos:escribir">
              <CandidatoForm />
            </ProtectedRoute>
          }
        />
        <Route path="solicitudes" element={<Solicitudes />} />
        <Route
          path="solicitudes/nueva"
          element={
            <ProtectedRoute permiso="solicitudes:crear">
              <SolicitudForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="solicitudes/:id/editar"
          element={
            <ProtectedRoute permiso="solicitudes:editar">
              <SolicitudForm />
            </ProtectedRoute>
          }
        />
        <Route path="solicitudes/:id" element={<SolicitudDetalle />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
