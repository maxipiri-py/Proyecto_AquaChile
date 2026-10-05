import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useData } from '../context/DataContext.jsx'
import { FAMILIAS_CARGO, ORIGENES, UBICACIONES } from '../utils/estados.js'
import { validarCandidato } from '../utils/validaciones.js'

const VACIO = { nombre: '', correo: '', telefono: '', cargo: '', familiaCargo: '', origen: '', ubicacion: '', referido: false }

export default function CandidatoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { candidatoPorId, agregarCandidato, actualizarCandidato } = useData()
  const existente = id ? candidatoPorId(id) : null

  const [datos, setDatos] = useState(existente ?? VACIO)
  const [errores, setErrores] = useState({})

  if (id && !existente) {
    return <p className="text-secondary">No encontramos ese candidato. Vuelve al listado e inténtalo de nuevo.</p>
  }

  const cambiar = (campo) => (ev) => {
    const valor = ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value
    setDatos((d) => ({ ...d, [campo]: valor }))
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: undefined }))
  }

  const guardar = (ev) => {
    ev.preventDefault()
    const e = validarCandidato(datos)
    setErrores(e)
    if (Object.keys(e).length) return
    if (existente) actualizarCandidato(existente.id, datos)
    else agregarCandidato(datos)
    navigate('/candidatos')
  }

  const campoTexto = (campo, etiqueta, tipo = 'text', ayuda) => (
    <Form.Group controlId={campo}>
      <Form.Label>{etiqueta}</Form.Label>
      <Form.Control type={tipo} value={datos[campo]} onChange={cambiar(campo)} isInvalid={!!errores[campo]} placeholder={ayuda} />
      <Form.Control.Feedback type="invalid">{errores[campo]}</Form.Control.Feedback>
    </Form.Group>
  )

  const campoSelect = (campo, etiqueta, opciones) => (
    <Form.Group controlId={campo}>
      <Form.Label>{etiqueta}</Form.Label>
      <Form.Select value={datos[campo]} onChange={cambiar(campo)} isInvalid={!!errores[campo]}>
        <option value="">Selecciona una opción</option>
        {opciones.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">{errores[campo]}</Form.Control.Feedback>
    </Form.Group>
  )

  return (
    <>
      <h1 className="h3 mb-4">{existente ? 'Editar candidato' : 'Registrar candidato'}</h1>
      <Form noValidate onSubmit={guardar} className="bloque">
        <Row className="g-3">
          <Col md={6}>{campoTexto('nombre', 'Nombre completo')}</Col>
          <Col md={6}>{campoTexto('correo', 'Correo electrónico', 'email', 'nombre@correo.cl')}</Col>
          <Col md={6}>{campoTexto('telefono', 'Teléfono', 'tel', '+56 9 1234 5678')}</Col>
          <Col md={6}>{campoTexto('cargo', 'Cargo al que postula')}</Col>
          <Col md={6}>{campoSelect('familiaCargo', 'Familia de cargo', FAMILIAS_CARGO)}</Col>
          <Col md={6}>{campoSelect('ubicacion', 'Ubicación', UBICACIONES)}</Col>
          <Col md={6}>{campoSelect('origen', 'Origen del candidato', ORIGENES)}</Col>
          <Col md={6} className="d-flex align-items-end">
            <Form.Check id="referido" type="checkbox" label="Es un candidato referido" checked={datos.referido} onChange={cambiar('referido')} />
          </Col>
        </Row>
        <div className="d-flex gap-2 mt-4">
          <Button type="submit">{existente ? 'Guardar cambios' : 'Registrar candidato'}</Button>
          <Button variant="outline-secondary" onClick={() => navigate('/candidatos')}>
            Cancelar
          </Button>
        </div>
      </Form>
    </>
  )
}
