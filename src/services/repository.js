// Capa de acceso a datos del prototipo (localStorage + datos simulados).
// Cuando exista el backend, solo hay que reemplazar el contenido de este archivo
// por llamadas fetch a la API REST; las vistas no cambian.
import { CANDIDATOS_SEED, SOLICITUDES_SEED } from '../data/seed.js'

const CLAVE = 'aquachile-demo-data-v2'

export function cargarDatos() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado) return JSON.parse(guardado)
  } catch {
    /* si falla el almacenamiento se usan los datos de ejemplo */
  }
  return { candidatos: CANDIDATOS_SEED, solicitudes: SOLICITUDES_SEED }
}

export function guardarDatos(datos) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos))
  } catch {
    /* almacenamiento no disponible: los datos viven solo en memoria */
  }
}

export function reiniciarDatos() {
  try {
    localStorage.removeItem(CLAVE)
  } catch {
    /* nada que limpiar */
  }
  return { candidatos: CANDIDATOS_SEED, solicitudes: SOLICITUDES_SEED }
}

export function siguienteId(lista) {
  return lista.reduce((max, item) => Math.max(max, item.id), 0) + 1
}
