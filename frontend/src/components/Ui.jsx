import { useEffect, useState } from 'react'

/** Pastille de disponibilité réutilisable (cartes, fiche détail). */
export function BadgeDispo({ disponible }) {
  return disponible ? (
    <span className="badge badge-oui">✓ En stock</span>
  ) : (
    <span className="badge badge-non">✕ Rupture</span>
  )
}

/** Modale de confirmation utilisée avant une suppression. */
export function ModaleConfirmation({ titre, message, enCours, onAnnuler, onConfirmer }) {
  useEffect(() => {
    const fermer = (e) => e.key === 'Escape' && onAnnuler()
    window.addEventListener('keydown', fermer)
    return () => window.removeEventListener('keydown', fermer)
  }, [onAnnuler])

  return (
    <div className="modale-fond" onClick={onAnnuler} role="presentation">
      <div
        className="modale"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{titre}</h3>
        <p>{message}</p>
        <div className="modale-actions">
          <button className="btn btn-fantome" onClick={onAnnuler} disabled={enCours}>
            Annuler
          </button>
          <button className="btn btn-danger" onClick={onConfirmer} disabled={enCours}>
            {enCours ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function EtatChargement({ texte = 'Chargement…' }) {
  return (
    <div className="etat-central">
      <span className="spin" aria-hidden="true" />
      <p>{texte}</p>
    </div>
  )
}

export function EtatVide({ emoji = '📦', titre, texte, action }) {
  return (
    <div className="etat-central">
      <span className="emoji" aria-hidden="true">{emoji}</span>
      <h2 className="section-titre">{titre}</h2>
      <p className="muted">{texte}</p>
      {action}
    </div>
  )
}

export function EtatErreur({ erreur, reessayer }) {
  return (
    <div className="etat-central">
      <span className="emoji" aria-hidden="true">🔌</span>
      <h2 className="section-titre">Impossible de contacter le serveur</h2>
      <p className="muted">{erreur?.message ?? 'Erreur inconnue'}</p>
      {reessayer && (
        <button className="btn btn-primaire" onClick={reessayer}>
          Réessayer
        </button>
      )}
    </div>
  )
}

/** Petit hook utilitaire : charge les utilisateurs une seule fois. */
export function useUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([])
  useEffect(() => {
    let vivant = true
    fetch('/api/utilisateurs/')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('API indisponible'))))
      .then((d) => vivant && setUtilisateurs(Array.isArray(d) ? d : []))
      .catch(() => {})
    return () => {
      vivant = false
    }
  }, [])
  return utilisateurs
}
