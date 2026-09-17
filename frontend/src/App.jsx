import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Accueil from './pages/Accueil'
import Produits from './pages/Produits'
import ProduitNouveau from './pages/ProduitNouveau'
import ProduitDetail from './pages/ProduitDetail'

function Page404() {
  return (
    <main className="conteneur">
      <div className="etat-central">
        <span className="emoji" aria-hidden="true">🧭</span>
        <h1 className="section-titre">Page introuvable</h1>
        <p className="muted">Cette vitrine n'existe pas (ou plus).</p>
        <Link to="/" className="btn btn-primaire">
          Retour à l'accueil
        </Link>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/produits/nouveau" element={<ProduitNouveau />} />
          <Route path="/produits/:id" element={<ProduitDetail />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
