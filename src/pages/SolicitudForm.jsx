import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { FAMILIAS_CARGO, documentosPorFamilia } from '../utils/estados.js'
import { puedeEditarSolicitud } from '../utils/flujo.js'
import { validarSolicitud } from '../utils/validaciones.js'
import { USUARIOS } from '../data/seed.js'

const EVALUADORES = USUARIOS.filter((u) => u.rol === 'evaluador').map((u) => u.nombre)

// Sirve para crear una solicitud nueva y para editar una existente (ruta /solicitudes/:id/editar).
export default function SolicitudForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const { candidatos, candidatoPorId, solicitudPorId, agregarSolicitud, actualizarSolicitud } = useData()
  const existente = id ? solicitudPorId(id) : null

  const [datos, setDatos] = useState(
    existente
      ? {
          candidatoId: String(existente.candidatoId),
          cargo: existente.cargo,
          familiaCargo: existente.familiaCargo,
          responsable: existente.responsable,
          observaciones: existente.observaciones,
          cv: existente.cv,
        }
      : { candidatoId: '', cargo: '', familiaCargo: '', responsable: '', observaciones: '', cv: '' },
  )
  const [errores, setErrores] = useState({})

  if (id && !existente) {
    return <p className="text-secondary">No encontramos esa solicitud. Vuelve al listado e inténtalo de nuevo.</p>
  }

  if (existente && !puedeEditarSolicitud(existente)) {
    return (
      <>
        <Alert variant="warning">
          Esta solicitud ya tiene el informe enviado, por eso no se puede editar. Pídele al evaluador que reabra el informe si hay que corregir algo.
        </Alert>
        <Link to={`/solicitudes/${existente.id}`}>Volver a la solicitud</Link>
      </>
    )
  }

  const cambiar = (campo) => (ev) => {
    setDatos((d) => ({ ...d, [campo]: ev.target.value }))
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: undefined }))
  }

  // Al elegir candidato se precargan cargo y familia, que igual se pueden corregir.
  const elegirCandidato = (ev) => {
    const c = candidatoPorId(ev.target.value)
    setDatos((d) => ({
      ...d,
      candidatoId: ev.target.value,
      cargo: c ? c.cargo : d.cargo,
      familiaCargo: c ? c.familiaCargo : d.familiaCargo,
    }))
    setErrores((e) => ({ ...e, candidatoId: undefined }))
  }

  // Solo se guarda el nombre del archivo: el prototipo no sube documentos reales.
  const elegirCv = (ev) => {
    const archivo = ev.target.files?.[0]
    setDatos((d) => ({ ...d, cv: archivo ? archivo.name : d.cv }))
    setErrores((e) => ({ ...e, cv: undefined }))
  }

  const guardar = (ev) => {
    ev.preventDefault()
    const e = validarSolicitud(datos)
    setErrores(e)
    if (Object.keys(e).length) return
    const docs = documentosPorFamilia(datos.familiaCargo)
    if (existente) {
      actualizarSolicitud(existente.id, {
        cargo: datos.cargo,
        familiaCargo: datos.familiaCargo,
        responsable: datos.responsable,
        observaciones: datos.observaciones,
        cv: datos.cv,
        ...docs,
      })
      navigate(`/solicitudes/${existente.id}`)
    } else {
      const nueva = agregarSolicitud({
        ...datos,
        candidatoId: Number(datos.candidatoId),
        creadaPor: usuario.nombre,
        ...docs,
      })
      navigate(`/solicitudes/${nueva.id}`)
    }
  }

  const docs = datos.familiaCargo ? documentosPorFamilia(datos.familiaCargo) : null

  return (
    <>
      <h1 className="h3 mb-4">{existente ? 'Editar solicitud' : 'Nueva solicitud de evaluación'}</h1>
      <Form noValidate onSubmit={guardar} className="bloque">
        <Row className="g-3">
          <Col md={12}>
            <Form.Group controlId="candidatoId">
              <Form.Label>Candidato</Form.Label>
              <Form.Select value={datos.candidatoId} onChange={elegirCandidato} isInvalid={!!errores.candidatoId} disabled={!!existente}>
                <option value="">Selecciona un candidato</option>
                {candidatos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errores.candidatoId}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="cargo">
              <Form.Label>Cargo</Form.Label>
              <Form.Control value={datos.cargo} onChange={cambiar('cargo')} isInvalid={!!errores.cargo} />
              <Form.Control.Feedback type="invalid">{errores.cargo}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="familiaCargo">
              <Form.Label>Familia de cargo</Form.Label>
              <Form.Select value={datos.familiaCargo} onChange={cambiar('familiaCargo')} isInvalid={!!errores.familiaCargo}>
                <option value="">Selecciona una opción</option>
                {FAMILIAS_CARGO.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errores.familiaCargo}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="responsable">
              <Form.Label>Profesional evaluador</Form.Label>
              <Form.Select value={datos.responsable} onChange={cambiar('responsable')} isInvalid={!!errores.responsable}>
                <option value="">Selecciona un evaluador</option>
                {EVALUADORES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errores.responsable}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="cv">
              <Form.Label>Currículum del candidato</Form.Label>
              <Form.Control type="file" accept=".pdf,.doc,.docx" onChange={elegirCv} isInvalid={!!errores.cv} />
              {datos.cv && <Form.Text>Archivo actual: {datos.cv}</Form.Text>}
              <Form.Control.Feedback type="invalid">{errores.cv}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group controlId="observaciones">
              <Form.Label>Aspectos a indagar (opcional)</Form.Label>
              <Form.Control as="textarea" rows={3} value={datos.observaciones} onChange={cambiar('observaciones')} />
            </Form.Group>
          </Col>
        </Row>

        {docs && (
          <div className="carpeta-aviso mt-4">
            Al guardar se crea la carpeta del candidato con el CV, la plantilla <strong>{docs.plantillaInforme}</strong> y la pauta{' '}
            <strong>{docs.pautaEntrevista}</strong>, elegidas según la familia de cargo.
          </div>
        )}

        <div className="d-flex gap-2 mt-4">
          <Button type="submit">{existente ? 'Guardar cambios' : 'Crear solicitud'}</Button>
          <Button variant="outline-secondary" onClick={() => navigate(existente ? `/solicitudes/${existente.id}` : '/solicitudes')}>
            Cancelar
          </Button>
        </div>
      </Form>
    </>
  )
}
