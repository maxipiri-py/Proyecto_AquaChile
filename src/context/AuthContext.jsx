import { createContext, useContext, useState } from 'react'
import { USUARIOS } from '../data/seed.js'

const PERMISOS = {
  analista: ['candidatos:escribir', 'solicitudes:crear', 'solicitudes:editar', 'informe:recibir'],
  evaluador: ['entrevista:gestionar', 'informe:redactar'],
  jefatura: ['solicitudes:exportar'],
}

const ROLES = { analista: 'Analista de Reclutamiento', evaluador: 'Profesional Evaluador', jefatura: 'Jefatura' }

// Descripción de lo que puede hacer cada rol (se muestra en la pantalla de inicio).
export const RESUMEN_ROL = {
  analista: [
    'Registrar candidatos y crear solicitudes de evaluación adjuntando el CV',
    'Editar una solicitud mientras el informe no se haya enviado',
    'Marcar como recibido el informe que entrega el evaluador',
  ],
  evaluador: [
    'Ver tus solicitudes asignadas en un tablero por etapa',
    'Agendar la entrevista y marcarla como realizada',
    'Redactar el informe por secciones, enviarlo y reabrirlo si hay que corregirlo',
  ],
  jefatura: [
    'Revisar indicadores del proceso: tiempos, carga por evaluador y resultados',
    'Consultar cualquier solicitud en modo lectura',
    'Exportar el listado de solicitudes a CSV',
  ],
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('aquachile-usuario'))
    } catch {
      return null
    }
  })

  const login = (correo, clave) => {
    const encontrado = USUARIOS.find(
      (u) => u.correo.toLowerCase() === correo.trim().toLowerCase() && u.clave === clave,
    )
    if (!encontrado) return false
    const { clave: _omitida, ...publico } = encontrado
    setUsuario(publico)
    try {
      sessionStorage.setItem('aquachile-usuario', JSON.stringify(publico))
    } catch {
      /* sesión solo en memoria */
    }
    return true
  }

  const logout = () => {
    setUsuario(null)
    try {
      sessionStorage.removeItem('aquachile-usuario')
    } catch {
      /* nada que limpiar */
    }
  }

  const can = (permiso) => !!usuario && PERMISOS[usuario.rol]?.includes(permiso)

  return (
    <AuthContext.Provider value={{ usuario, login, logout, can, etiquetaRol: usuario ? ROLES[usuario.rol] : '' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
