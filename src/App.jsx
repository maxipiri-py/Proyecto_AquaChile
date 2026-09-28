import Navbar from './components/Navbar';
import TablaCandidatos from './components/TablaCandidatos';

function App() {
  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <main className="container py-4">
        <div className="p-4 bg-white rounded-3 shadow-sm mb-4">
          <h2 className="h4 text-dark fw-bold mb-1">Proyecto AquaChile</h2>
          <p className="text-muted mb-0">
            Bienvenido al sistema de evaluaciones psicolaborales para el área de selección.
          </p>
        </div>

        {/* Módulo de candidatos */}
        <TablaCandidatos />
      </main>
    </div>
  );
}

export default App;