import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Alert, Button, Form } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext.jsx'

const DEMOS = [
  { rol: 'Analista', correo: 'analista@demo.cl' },
  { rol: 'Evaluador', correo: 'evaluador@demo.cl' },
  { rol: 'Jefatura', correo: 'jefatura@demo.cl' },
]

export default function Login() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  if (usuario) return <Navigate to="/" replace />

  const enviar = (ev) => {
    ev.preventDefault()
    const e = {}
    if (!correo.trim()) e.correo = 'Ingresa tu correo.'
    if (!clave) e.clave = 'Ingresa tu clave.'
    setErrores(e)
    setErrorGeneral('')
    if (Object.keys(e).length) return
    if (login(correo, clave)) navigate('/')
    else setErrorGeneral('Correo o clave incorrectos. Revisa los datos o usa uno de los accesos de ejemplo.')
  }

  const usarDemo = (c) => {
    setCorreo(c)
    setClave('demo1234')
    setErrores({})
    setErrorGeneral('')
  }

  return (
    <div className="login-pagina">
      <div className="login-panel">
        <h1 className="h3 mb-1">AquaChile</h1>
        <p className="text-secondary mb-4">Gestión de evaluaciones psicolaborales · Prototipo con datos ficticios</p>

        {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}

        <Form noValidate onSubmit={enviar}>
          <Form.Group className="mb-3" controlId="correo">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              isInvalid={!!errores.correo}
              autoComplete="username"
            />
            <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="clave">
            <Form.Label>Clave</Form.Label>
            <Form.Control
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              isInvalid={!!errores.clave}
              autoComplete="current-password"
            />
            <Form.Control.Feedback type="invalid">{errores.clave}</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" className="w-100">
            Ingresar
          </Button>
        </Form>

        <hr className="my-4" />
        <p className="small text-secondary mb-2">Accesos de ejemplo (clave demo1234):</p>
        <div className="d-flex flex-wrap gap-2">
          {DEMOS.map((d) => (
            <Button key={d.correo} variant="outline-secondary" size="sm" onClick={() => usarDemo(d.correo)}>
              {d.rol}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
