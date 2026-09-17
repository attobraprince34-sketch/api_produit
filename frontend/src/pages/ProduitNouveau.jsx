import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useUtilisateurs } from '../components/Ui'

export default function ProduitNouveau() {
  const navigate = useNavigate()
  const utilisateurs = useUtilisateurs()

  const [form, setForm] = useState({
    owner: '',
    nom_produit: '',
    prix: '',
    disponibilite: false,
    description: '',
  })
  const [fichier, setFichier] = useState(null)
  const [apercu, setApercu] = useState(null)
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState(false)
  const [erreurGlobale, setErreurGlobale] = useState(null)

  const changer = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const choisirFichier = (e) => {
    const f = e.target.files?.[0] ?? null
    setFichier(f)
    setApercu(f ? URL.createObjectURL(f) : null)
  }

  const soumettre = async (e) => {
    e.preventDefault()
    setEnvoi(true)
    setErreurs({})
    setErreurGlobale(null)

    const fd = new FormData()
    fd.append('owner', form.owner)
    fd.append('nom_produit', form.nom_produit)
    fd.append('prix', form.prix || '0.00')
    fd.append('disponibilite', String(form.disponibilite))
    fd.append('description', form.description)
    if (fichier) fd.append('image_produit', fichier)

    try {
      const cree = await api.createProduit(fd)
      navigate(`/produits/${cree.id}`)
    } catch (err) {
      if (err.status === 400 && err.data) {
        setErreurs(err.data)
      } else {
        setErreurGlobale(err.message)
      }
      setEnvoi(false)
    }
  }

  return (
    <main className="conteneur">
      <form className="formulaire" onSubmit={soumettre} noValidate>
        <h1 className="section-titre" style={{ marginBottom: 6 }}>
          Publier un produit
        </h1>
        <p className="muted" style={{ marginTop: 0, marginBottom: 24 }}>
          Trois champs obligatoires, une photo facultative — et c'est en ligne.
        </p>

        {erreurGlobale && (
          <div className="alerte alerte-erreur" role="alert">
            {erreurGlobale}
          </div>
        )}

        <div className="champ">
          <label htmlFor="owner">Vendeur</label>
          <select
            id="owner"
            name="owner"
            value={form.owner}
            onChange={changer}
            required
          >
            <option value="" disabled>
              {utilisateurs.length ? 'Choisir un vendeur…' : 'Chargement des vendeurs…'}
            </option>
            {utilisateurs.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          {erreurs.owner && <p className="erreur">{erreurs.owner}</p>}
        </div>

        <div className="champ">
          <label htmlFor="nom_produit">Nom du produit *</label>
          <input
            id="nom_produit"
            name="nom_produit"
            value={form.nom_produit}
            onChange={changer}
            placeholder="Ex. : orange, savon artisanal…"
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
              placeholder="0.00"
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
            placeholder="Décrivez le produit : origine, qualités, conseils d'usage…"
            required
          />
          {erreurs.description && <p className="erreur">{erreurs.description}</p>}
        </div>

        <div className="champ">
          <label htmlFor="image_produit">Photo du produit (facultatif)</label>
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
          {apercu && (
            <img src={apercu} alt="Aperçu de l'image" className="apercu-image" />
          )}
          {erreurs.image_produit && <p className="erreur">{erreurs.image_produit}</p>}
        </div>

        <div className="formulaire-bas">
          <Link to="/produits" className="btn btn-fantome">
            Annuler
          </Link>
          <button className="btn btn-primaire" type="submit" disabled={envoi || !form.owner}>
            {envoi ? 'Publication…' : 'Publier le produit'}
          </button>
        </div>
      </form>
    </main>
  )
}
