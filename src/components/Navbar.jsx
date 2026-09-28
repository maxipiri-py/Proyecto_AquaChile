export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3 shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold" href="#">
          Proyecto AquaChile
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#">Inicio / Dashboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Candidatos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Solicitudes</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}