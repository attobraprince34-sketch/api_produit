import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatPrix, referenceCourte } from '../api/client'
import { BadgeDispo, EtatChargement, EtatErreur, EtatVide } from '../components/Ui'

export default function Produits() {
  const [produits, setProduits] = useState([])
  const [etat, setEtat] = useState('chargement')
  const [erreur, setErreur] = useState(null)
  const [recherche, setRecherche] = useState('')

  const charger = () => {
    setEtat('chargement')
    setErreur(null)
    api
      .produits()
      .then((data) => {
        setProduits(data)
        setEtat('pret')
      })
      .catch((e) => {
        setErreur(e)
        setEtat('erreur')
      })
  }

  useEffect(charger, [])

  const filtres = useMemo(() => {
    const q = recherche.trim().toLowerCase()
    if (!q) return produits
    return produits.filter(
      (p) =>
        p.nom_produit?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    )
  }, [produits, recherche])

  return (
    <main className="conteneur">
      <div className="page-entete">
        <h1>La boutique</h1>
        <p>Tous les produits publiés via l'API, en direct.</p>
      </div>

      <div className="barre-outils">
        <label className="champ-recherche">
          <span aria-hidden="true">🔍</span>
          <input
            type="search"
            placeholder="Rechercher un produit…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </label>
        <Link to="/produits/nouveau" className="btn btn-primaire">
          + Publier un produit
        </Link>
      </div>

      {etat === 'chargement' && <EtatChargement texte="Chargement du catalogue…" />}
      {etat === 'erreur' && <EtatErreur erreur={erreur} reessayer={charger} />}
      {etat === 'pret' && filtres.length === 0 && (
        <EtatVide
          emoji={recherche ? '🔍' : '📦'}
          titre={recherche ? 'Aucun résultat' : 'Aucun produit pour le moment'}
          texte={
            recherche
              ? 'Essayez un autre mot-clé.'
              : 'La vitrine attend son premier produit.'
          }
          action={
            !recherche && (
              <Link to="/produits/nouveau" className="btn btn-primaire">
                + Publier un produit
              </Link>
            )
          }
        />
      )}

      {etat === 'pret' && filtres.length > 0 && (
        <div className="grille-produits">
          {filtres.map((p) => (
            <Link to={`/produits/${p.id}`} key={p.id} className="carte-produit">
              <div className="carte-media">
                {p.image_produit ? (
                  <img src={p.image_produit} alt={p.nom_produit} />
                ) : (
                  <span className="carte-emoji-fallback">🧺</span>
                )}
                <BadgeDispo disponible={p.disponibilite} />
              </div>
              <div className="carte-corps">
                <h3>{p.nom_produit}</h3>
                <p className="carte-description">{p.description}</p>
                <div className="carte-bas">
                  <span className="prix">{formatPrix(p.prix)}</span>
                  <span className="carte-vente">réf. {referenceCourte(p.id)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
