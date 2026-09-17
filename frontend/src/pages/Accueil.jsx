import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatPrix, referenceCourte } from '../api/client'
import { BadgeDispo, EtatErreur, EtatChargement } from '../components/Ui'

export default function Accueil() {
  const [produits, setProduits] = useState([])
  const [etat, setEtat] = useState('chargement')

  useEffect(() => {
    let vivant = true
    api
      .produits()
      .then((data) => {
        if (!vivant) return
        setProduits(data)
        setEtat('pret')
      })
      .catch(() => vivant && setEtat('erreur'))
    return () => {
      vivant = false
    }
  }, [])

  const dispo = produits.filter((p) => p.disponibilite)
  const vedette = dispo[0] ?? produits[0]

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="conteneur hero-inner">
          <div>
            <span className="sur-titre">✨ Boutique de démonstration</span>
            <h1>
              Vendez ce qui mérite <em>d'être vu</em>.
            </h1>
            <p className="hero-sous-titre">
              Vitrine transforme votre catalogue en boutique élégante : publiez
              un produit en trois champs, partagez le lien, encaissez les
              compliments.
            </p>
            <div className="hero-actions">
              <Link to="/produits" className="btn btn-primaire">
                Découvrir la boutique
              </Link>
              <a href="/#etapes" className="btn btn-fantome">
                Comment ça marche
              </a>
            </div>
            <div className="hero-chiffres">
              <div>
                <strong>{produits.length}</strong>
                <span>produits en ligne</span>
              </div>
              <div>
                <strong>{dispo.length}</strong>
                <span>disponibles</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>API ouverte</span>
              </div>
            </div>
          </div>

          <div className="hero-visuel">
            <div className="carte-flottante">
              {etat === 'chargement' ? (
                <div style={{ height: 300, display: 'grid', placeItems: 'center' }}>
                  <span className="spin" />
                </div>
              ) : vedette ? (
                <>
                  {vedette.image_produit ? (
                    <img src={vedette.image_produit} alt={vedette.nom_produit} />
                  ) : (
                    <div className="carte-emoji-fallback" style={{ position: 'static', height: 300 }}>
                      🍊
                    </div>
                  )}
                  <div className="carte-ligne">
                    <h3>{vedette.nom_produit}</h3>
                    <span className="prix">{formatPrix(vedette.prix)}</span>
                  </div>
                  <div className="carte-pastilles">
                    <BadgeDispo disponible={vedette.disponibilite} />
                    <span className="badge badge-ambre">réf. {referenceCourte(vedette.id)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="carte-emoji-fallback" style={{ position: 'static', height: 300 }}>
                    🧺
                  </div>
                  <div className="carte-ligne">
                    <h3>Votre premier produit</h3>
                    <Link className="btn btn-primaire btn-petit" to="/produits/nouveau">
                      Publier
                    </Link>
                  </div>
                  <p className="muted" style={{ fontSize: '0.85rem', margin: '8px 0 0' }}>
                    Ajoutez un nom, un prix, une description — c'est tout.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- ÉTAPES ---------------- */}
      <section className="etapes" id="etapes">
        <div className="conteneur section" style={{ padding: '64px 0' }}>
          <h2 className="section-titre">Trois étapes, zéro friction</h2>
          <p className="section-sous-titre">
            Pensé pour les vendeurs qui veulent publier vite — et pour les
            curieux qui veulent lire une API propre.
          </p>
          <div className="etapes-grid">
            <div className="etape">
              <span className="etape-num">1</span>
              <div>
                <h3>Décrivez le produit</h3>
                <p>
                  Nom, prix, description, disponibilité. Ajoutez une photo si
                  vous en avez une.
                </p>
              </div>
            </div>
            <div className="etape">
              <span className="etape-num">2</span>
              <div>
                <h3>Publiez en un clic</h3>
                <p>
                  Le formulaire parle directement à l'API Django — aucune
                  étape intermédiaire.
                </p>
              </div>
            </div>
            <div className="etape">
              <span className="etape-num">3</span>
              <div>
                <h3>Partagez votre vitrine</h3>
                <p>
                  Chaque produit a sa propre page, prête à être envoyée à vos
                  clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- APERÇU DU CATALOGUE ---------------- */}
      <section className="section">
        <div className="conteneur">
          <div className="barre-outils" style={{ paddingBottom: 24 }}>
            <div>
              <h2 className="section-titre">Derniers arrivages</h2>
              <p className="section-sous-titre" style={{ marginBottom: 0 }}>
                Un aperçu direct depuis l'API — rechargez pour voir les nouveautés.
              </p>
            </div>
            <Link to="/produits" className="btn btn-fantome">
              Tout voir →
            </Link>
          </div>

          {etat === 'erreur' ? (
            <EtatErreur erreur={{ message: 'L\'API Django ne répond pas.' }} />
          ) : etat === 'chargement' ? (
            <EtatChargement texte="Récupération du catalogue…" />
          ) : produits.length === 0 ? (
            <div className="etat-central">
              <span className="emoji" aria-hidden="true">🧺</span>
              <h2 className="section-titre">La vitrine est encore vide</h2>
              <p className="muted">Publiez le premier produit pour lancer la boutique.</p>
              <Link to="/produits/nouveau" className="btn btn-primaire">
                + Publier un produit
              </Link>
            </div>
          ) : (
            <div className="grille-produits">
              {produits.slice(0, 3).map((p) => (
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
        </div>
      </section>

      {/* ---------------- BANDEAU API ---------------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="conteneur">
          <div className="bandeau-api">
            <div>
              <h2>Sous le capot, une vraie API REST</h2>
              <p>
                Cette boutique est branchée sur Django REST Framework : CRUD
                complet sur les produits, schéma OpenAPI généré par
                drf-spectacular, images servies par Django. Explorez la
                documentation interactive pour tout voir.
              </p>
              <div className="hero-actions" style={{ marginBottom: 0 }}>
                <a href="/api/schema/swagger-ui/" className="btn btn-primaire">
                  Ouvrir Swagger UI
                </a>
                <a href="/api/schema/redoc/" className="btn btn-fantome">
                  ReDoc
                </a>
              </div>
            </div>
            <pre className="code-apercu">
{`GET /api/produits/
[
  {
    "id": "d038354b-…",
    "nom_produit": "`}<span className="c-chaine">orange</span>{`",
    "prix": "`}<span className="c-nombre">1000.00</span>{`",
    "disponibilite": `}<span className="c-nombre">true</span>{`
  }
]`}
            </pre>
          </div>
        </div>
      </section>
    </>
  )
}
