import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="pied">
      <div className="conteneur pied-inner">
        <Link to="/" className="logo">
          <span className="logo-pastille">🍊</span>
          Vitrine
        </Link>
        <p>
          Démo full-stack — Django REST Framework + React. Documentation
          interactive : <Link to="/api-docs">Swagger UI</Link>
        </p>
        <span>© {new Date().getFullYear()} Vitrine</span>
      </div>
    </footer>
  )
}
