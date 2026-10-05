import { createContext, useContext, useEffect, useState } from 'react'
import { cargarDatos, guardarDatos, reiniciarDatos, siguienteId } from '../services/repository.js'
import { hoyISO } from '../utils/estados.js'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [datos, setDatos] = useState(cargarDatos)

  useEffect(() => {
    guardarDatos(datos)
  }, [datos])

  const agregarCandidato = (candidato) => {
    const nuevo = { ...candidato, id: siguienteId(datos.candidatos) }
    setDatos((d) => ({ ...d, candidatos: [...d.candidatos, nuevo] }))
    return nuevo
  }

  const actualizarCandidato = (id, cambios) =>
    setDatos((d) => ({
      ...d,
      candidatos: d.candidatos.map((c) => (c.id === id ? { ...c, ...cambios } : c)),
    }))

  const agregarSolicitud = (solicitud) => {
    const nueva = {
      ...solicitud,
      id: siguienteId(datos.solicitudes),
      fechaSolicitud: hoyISO(),
      estado: 'Evaluación recibida',
      entrevista: null,
      informe: null,
      fechaEnvio: null,
      informeRecibido: false,
    }
    setDatos((d) => ({ ...d, solicitudes: [...d.solicitudes, nueva] }))
    return nueva
  }

  const actualizarSolicitud = (id, cambios) =>
    setDatos((d) => ({
      ...d,
      solicitudes: d.solicitudes.map((s) => (s.id === id ? { ...s, ...cambios } : s)),
    }))

  const reiniciar = () => setDatos(reiniciarDatos())

  const candidatoPorId = (id) => datos.candidatos.find((c) => c.id === Number(id))
  const solicitudPorId = (id) => datos.solicitudes.find((s) => s.id === Number(id))

  return (
    <DataContext.Provider
      value={{
        candidatos: datos.candidatos,
        solicitudes: datos.solicitudes,
        agregarCandidato,
        actualizarCandidato,
        agregarSolicitud,
        actualizarSolicitud,
        candidatoPorId,
        solicitudPorId,
        reiniciar,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
