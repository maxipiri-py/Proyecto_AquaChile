const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const REGEX_TELEFONO = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/

export function validarCandidato(d) {
  const e = {}
  if (!d.nombre || d.nombre.trim().length < 3) e.nombre = 'Ingresa el nombre completo (mínimo 3 caracteres).'
  if (!d.correo || !REGEX_CORREO.test(d.correo.trim())) e.correo = 'Ingresa un correo válido, por ejemplo nombre@correo.cl.'
  if (!d.telefono || !REGEX_TELEFONO.test(d.telefono.trim())) e.telefono = 'Usa un celular chileno, por ejemplo +56 9 1234 5678.'
  if (!d.cargo || d.cargo.trim().length < 3) e.cargo = 'Indica el cargo al que postula.'
  if (!d.familiaCargo) e.familiaCargo = 'Selecciona la familia de cargo.'
  if (!d.origen) e.origen = 'Indica si el candidato es interno o externo.'
  if (!d.ubicacion) e.ubicacion = 'Selecciona la ubicación.'
  return e
}

export function validarSolicitud(d) {
  const e = {}
  if (!d.candidatoId) e.candidatoId = 'Selecciona un candidato.'
  if (!d.cargo || d.cargo.trim().length < 3) e.cargo = 'Indica el cargo de la solicitud.'
  if (!d.familiaCargo) e.familiaCargo = 'Selecciona la familia de cargo.'
  if (!d.responsable) e.responsable = 'Asigna un profesional evaluador.'
  if (!d.cv) e.cv = 'Adjunta el CV del candidato.'
  return e
}

export function validarEntrevista(d, fechaSolicitud) {
  const e = {}
  if (!d.fecha) e.fecha = 'Indica la fecha de la entrevista.'
  else if (fechaSolicitud && d.fecha < fechaSolicitud) e.fecha = 'La fecha no puede ser anterior a la solicitud.'
  if (!d.hora) e.hora = 'Indica la hora de la entrevista.'
  return e
}

// Valida el informe completo antes de enviarlo al analista.
export function validarInforme(d, fechaSolicitud) {
  const e = {}
  if (!d.fecha) e.fecha = 'Indica la fecha de la evaluación.'
  else if (fechaSolicitud && d.fecha < fechaSolicitud) e.fecha = 'La fecha no puede ser anterior a la solicitud.'
  if (!d.categoria) e.categoria = 'Selecciona la categoría del evaluado.'
  if (!d.conclusion || d.conclusion.trim().length < 10) e.conclusion = 'Escribe la conclusión general (mínimo 10 caracteres).'
  const faltantes = d.competencias.some(
    (c) => c.criterio.trim().length < 5 || c.fortalezas.trim().length < 5 || c.oportunidades.trim().length < 5,
  )
  if (faltantes) e.competencias = 'Completa criterio, fortalezas y oportunidades de cada competencia (mínimo 5 caracteres).'
  return e
}
