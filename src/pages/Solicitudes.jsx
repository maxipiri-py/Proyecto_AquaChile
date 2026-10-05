import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Col, Form, Row, Table } from 'react-bootstrap'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import EstadoBadge from '../components/EstadoBadge.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { ESTADOS, FAMILIAS_CARGO, formatearFecha } from '../utils/estados.js'
import { USUARIOS } from '../data/seed.js'
import { aCsv, descargarCsv } from '../utils/exportarCsv.js'

const EVALUADORES = USUARIOS.filter((u) => u.rol === 'evaluador').map((u) => u.nombre)

export default function Solicitudes() {
  const { solicitudes, candidatoPorId } = useData()
  const { can } = useAuth()
  const [texto, setTexto] = useState('')
  const [estado, setEstado] = useState('')
  const [familia, setFamilia] = useState('')
  const [responsable, setResponsable] = useState('')

  const filtradas = useMemo(() => {
    const t = texto.trim().toLowerCase()
    return solicitudes
      .filter((s) => {
        const nombre = candidatoPorId(s.candidatoId)?.nombre.toLowerCase() ?? ''
        return (
          (!t || nombre.includes(t) || s.cargo.toLowerCase().includes(t)) &&
          (!estado || s.estado === estado) &&
          (!familia || s.familiaCargo === familia) &&
          (!responsable || s.responsable === responsable)
        )
      })
      .sort((a, b) => b.fechaSolicitud.localeCompare(a.fechaSolicitud))
  }, [solicitudes, texto, estado, familia, responsable, candidatoPorId])

  const exportar = () => {
    const columnas = [
      { titulo: 'Candidato', valor: (s) => candidatoPorId(s.candidatoId)?.nombre },
      { titulo: 'Cargo', valor: (s) => s.cargo },
      { titulo: 'Familia de cargo', valor: (s) => s.familiaCargo },
      { titulo: 'Fecha de solicitud', valor: (s) => s.fechaSolicitud },
      { titulo: 'Evaluador', valor: (s) => s.responsable },
      { titulo: 'Etapa', valor: (s) => s.estado },
      { titulo: 'Categoría del evaluado', valor: (s) => s.informe?.categoria ?? '' },
      { titulo: 'Fecha de envío del informe', valor: (s) => s.fechaEnvio ?? '' },
    ]
    descargarCsv('solicitudes.csv', aCsv(filtradas, columnas))
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">Solicitudes de evaluación</h1>
          <p className="text-secondary mb-0">{filtradas.length} de {solicitudes.length} solicitudes</p>
        </div>
        {can('solicitudes:crear') && (
          <Button as={Link} to="/solicitudes/nueva">
            Nueva solicitud
          </Button>
        )}
        {can('solicitudes:exportar') && (
          <Button variant="outline-secondary" onClick={exportar} disabled={filtradas.length === 0}>
            Exportar a CSV
          </Button>
        )}
      </div>

      <Row className="g-2 mb-3">
        <Col md={12} lg={4}>
          <Form.Control type="search" placeholder="Buscar por candidato o cargo" aria-label="Buscar solicitud" value={texto} onChange={(e) => setTexto(e.target.value)} />
        </Col>
        <Col sm={4} lg={3}>
          <Form.Select aria-label="Filtrar por etapa" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todas las etapas</option>
            {ESTADOS.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </Form.Select>
        </Col>
        <Col sm={4} lg={3}>
          <Form.Select aria-label="Filtrar por familia de cargo" value={familia} onChange={(e) => setFamilia(e.target.value)}>
            <option value="">Todas las familias</option>
            {FAMILIAS_CARGO.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </Form.Select>
        </Col>
        <Col sm={4} lg={2}>
          <Form.Select aria-label="Filtrar por responsable" value={responsable} onChange={(e) => setResponsable(e.target.value)}>
            <option value="">Todos</option>
            {EVALUADORES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {filtradas.length === 0 ? (
        <EmptyState titulo="No hay solicitudes con esos criterios">Cambia los filtros o crea una nueva solicitud.</EmptyState>
      ) : (
        <div className="table-responsive bloque p-0">
          <Table hover className="align-middle mb-0">
            <thead>
              <tr>
                <th>Candidato</th>
                <th>Cargo</th>
                <th>Familia</th>
                <th>Solicitada</th>
                <th>Responsable</th>
                <th>Etapa</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Link to={`/solicitudes/${s.id}`} className="fw-semibold">
                      {candidatoPorId(s.candidatoId)?.nombre ?? 'Candidato eliminado'}
                    </Link>
                  </td>
                  <td>{s.cargo}</td>
                  <td>{s.familiaCargo}</td>
                  <td>{formatearFecha(s.fechaSolicitud)}</td>
                  <td>{s.responsable}</td>
                  <td>
                    <EstadoBadge estado={s.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  )
}
