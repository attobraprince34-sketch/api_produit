import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const [ouvert, setOuvert] = useState(false)

  return (
    <header className="navbar">
      <div className="conteneur navbar-inner">
        <Link to="/" className="logo" onClick={() => setOuvert(false)}>
          <span className="logo-pastille">🍊</span>
          Vitrine
        </Link>

        <nav className={`nav-liens${ouvert ? ' ouvert' : ''}`}>
          <NavLink to="/" onClick={() => setOuvert(false)}>Accueil</NavLink>
          <a href="/#etapes" onClick={() => setOuvert(false)}>Comment ça marche</a>
          <Link to="/produits" onClick={() => setOuvert(false)}>Produits</Link>
          <Link
            to="/produits/nouveau"
            className="btn btn-primaire btn-petit"
            onClick={() => setOuvert(false)}
          >
            + Publier
          </Link>
        </nav>

        <button
          className="nav-burger"
          aria-label="Ouvrir le menu"
          onClick={() => setOuvert((v) => !v)}
        >
          {ouvert ? '✕' : '☰'}
        </button>
      </div>
    </header>
  )
}
