import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      {/* barra de navegacion */}
      <Navbar />

      {/* 2. area de contenido*/}
      <main className="container mt-4">
        <h2>Proyecto AquaChile</h2>
        <p>Bienvenido al sistema de evaluaciones psicolaborales.</p>
      </main>
    </div>
  );
}

export default App;
