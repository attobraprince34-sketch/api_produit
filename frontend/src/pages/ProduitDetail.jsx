import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, formatPrix, referenceCourte } from '../api/client'
import {
  BadgeDispo,
  EtatChargement,
  EtatErreur,
  ModaleConfirmation,
} from '../components/Ui'

export default function ProduitDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [produit, setProduit] = useState(null)
  const [etat, setEtat] = useState('chargement')
  const [erreur, setErreur] = useState(null)
  const [modeEdition, setModeEdition] = useState(false)
  const [form, setForm] = useState(null)
  const [fichier, setFichier] = useState(null)
  const [apercu, setApercu] = useState(null)
  const [erreurs, setErreurs] = useState({})
  const [enregistrement, setEnregistrement] = useState(false)
  const [suppression, setSuppression] = useState(false)
  const [confirmation, setConfirmation] = useState(false)
  const [message, setMessage] = useState(null)

  const charger = () => {
    setEtat('chargement')
    setErreur(null)
    api
      .produit(id)
      .then((data) => {
        setProduit(data)
        setEtat('pret')
      })
      .catch((e) => {
        setErreur(e)
        setEtat('erreur')
      })
  }

  useEffect(charger, [id])

  const demarrerEdition = () => {
    setForm({
      nom_produit: produit.nom_produit,
      prix: String(produit.prix ?? ''),
      disponibilite: Boolean(produit.disponibilite),
      description: produit.description ?? '',
    })
    setFichier(null)
    setApercu(null)
    setErreurs({})
    setModeEdition(true)
  }

  const changer = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const choisirFichier = (e) => {
    const f = e.target.files?.[0] ?? null
    setFichier(f)
    setApercu(f ? URL.createObjectURL(f) : null)
  }

  const enregistrer = async (e) => {
    e.preventDefault()
    setEnregistrement(true)
    setErreurs({})

    const fd = new FormData()
    fd.append('nom_produit', form.nom_produit)
    fd.append('prix', form.prix || '0.00')
    fd.append('disponibilite', String(form.disponibilite))
    fd.append('description', form.description)
    if (fichier) fd.append('image_produit', fichier)

    try {
      const maj = await api.updateProduit(id, fd)
      setProduit(maj)
      setModeEdition(false)
      setMessage('Produit mis à jour ✓')
    } catch (err) {
      if (err.status === 400 && err.data) setErreurs(err.data)
      else setMessage(`Erreur : ${err.message}`)
    } finally {
      setEnregistrement(false)
    }
  }

  const supprimer = async () => {
    setSuppression(true)
    try {
      await api.deleteProduit(id)
      navigate('/produits')
    } catch (err) {
      setMessage(`Erreur : ${err.message}`)
      setSuppression(false)
      setConfirmation(false)
    }
  }

  if (etat === 'chargement') return <main className="conteneur"><EtatChargement /></main>
  if (etat === 'erreur')
    return (
      <main className="conteneur">
        <EtatErreur erreur={erreur} reessayer={charger} />
      </main>
    )

  return (
    <main className="conteneur">
      <p style={{ paddingTop: 24, marginBottom: 0 }}>
        <Link to="/produits" className="muted">
          ← Retour à la boutique
        </Link>
      </p>

      <article className="detail">
        <div className="detail-media">
          {apercu ? (
            <img src={apercu} alt="Nouvelle image choisie" />
          ) : produit.image_produit ? (
            <img src={produit.image_produit} alt={produit.nom_produit} />
          ) : (
            <span className="emoji-fallback" aria-hidden="true">🧺</span>
          )}
        </div>

        <div className="detail-info">
          {!modeEdition ? (
            <>
              <div className="carte-pastilles" style={{ marginTop: 0, marginBottom: 12 }}>
                <BadgeDispo disponible={produit.disponibilite} />
                <span className="badge badge-ambre">réf. {referenceCourte(produit.id)}</span>
              </div>
              <h1>{produit.nom_produit}</h1>
              <div className="detail-prix">{formatPrix(produit.prix)}</div>
              <p className="detail-desc">{produit.description}</p>

              <dl className="detail-meta">
                <div>
                  <dt>Vendeur</dt>
                  <dd>{produit.owner_username ?? `Utilisateur #${produit.owner}`}</dd>
                </div>
                <div>
                  <dt>Référence</dt>
                  <dd>{produit.id}</dd>
                </div>
              </dl>

              <div className="detail-actions">
                <button className="btn btn-primaire" onClick={demarrerEdition}>
                  Modifier
                </button>
                <button className="btn btn-danger" onClick={() => setConfirmation(true)}>
                  Supprimer
                </button>
              </div>

              {message && (
                <div className="alerte alerte-succes" role="status">
                  {message}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={enregistrer} noValidate>
              <h1 className="section-titre" style={{ marginBottom: 18 }}>
                Modifier le produit
              </h1>

              <div className="champ">
                <label htmlFor="nom_produit">Nom du produit *</label>
                <input
                  id="nom_produit"
                  name="nom_produit"
                  value={form.nom_produit}
                  onChange={changer}
                  maxLength={100}
                  required
                />
                {erreurs.nom_produit && <p className="erreur">{erreurs.nom_produit}</p>}
              </div>

              <div className="champ-ligne">
                <div className="champ">
                  <label htmlFor="prix">Prix (FCFA)</label>
                  <input
                    id="prix"
                    name="prix"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.prix}
                    onChange={changer}
                  />
                  {erreurs.prix && <p className="erreur">{erreurs.prix}</p>}
                </div>
                <div className="champ">
                  <label htmlFor="disponibilite">Disponibilité</label>
                  <div className="case-coche" style={{ marginBottom: 0, paddingTop: 8 }}>
                    <input
                      id="disponibilite"
                      name="disponibilite"
                      type="checkbox"
                      checked={form.disponibilite}
                      onChange={changer}
                    />
                    <label htmlFor="disponibilite" style={{ margin: 0, fontWeight: 500 }}>
                      En stock
                    </label>
                  </div>
                </div>
              </div>

              <div className="champ">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={changer}
                  required
                />
                {erreurs.description && <p className="erreur">{erreurs.description}</p>}
              </div>

              <div className="champ">
                <label htmlFor="image_produit">Remplacer la photo (facultatif)</label>
                <label htmlFor="image_produit" className="bascule-image">
                  📷 Cliquez pour choisir une image
                  <input
                    id="image_produit"
                    type="file"
                    accept="image/*"
                    onChange={choisirFichier}
                    hidden
                  />
                </label>
                {erreurs.image_produit && <p className="erreur">{erreurs.image_produit}</p>}
              </div>

              <div className="detail-actions" style={{ marginTop: 22 }}>
                <button className="btn btn-primaire" type="submit" disabled={enregistrement}>
                  {enregistrement ? 'Enregistrement…' : 'Enregistrer'}
                </button>
                <button
                  className="btn btn-fantome"
                  type="button"
                  onClick={() => setModeEdition(false)}
                  disabled={enregistrement}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </article>

      {confirmation && (
        <ModaleConfirmation
          titre="Supprimer ce produit ?"
          message={`« ${produit.nom_produit} » sera définitivement supprimé. Cette action est irréversible.`}
          enCours={suppression}
          onAnnuler={() => setConfirmation(false)}
          onConfirmer={supprimer}
        />
      )}
    </main>
  )
}
