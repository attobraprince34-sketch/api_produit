/**
 * Client HTTP minimaliste pour l'API Django REST.
 * En développement, Vite proxifie /api et /media vers http://127.0.0.1:8000.
 * Pour pointer ailleurs (ex. production), définissez VITE_API_URL.
 */
const API_BASE = import.meta.env.VITE_API_URL ?? ''

function extractError(data, res) {
  if (!data) return `Erreur ${res.status}`
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  const first = Object.values(data)[0]
  if (Array.isArray(first)) return first.join(' ')
  if (typeof first === 'string') return first
  return `Erreur ${res.status}`
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options)
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(extractError(data, res))
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  /** GET /api/produits/ — liste complète du catalogue */
  produits: () => request('/api/produits/'),

  /** GET /api/produits/:id/ — fiche détaillée */
  produit: (id) => request(`/api/produits/${id}/`),

  /** POST /api/produits_creer/ — publication (multipart pour l'image) */
  createProduit: (formData) =>
    request('/api/produits_creer/', { method: 'POST', body: formData }),

  /** PATCH /api/produits/:id/ — mise à jour partielle (JSON ou FormData) */
  updateProduit: (id, data) => {
    if (data instanceof FormData) {
      return request(`/api/produits/${id}/`, { method: 'PATCH', body: data })
    }
    return request(`/api/produits/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  },

  /** DELETE /api/produits/:id/ */
  deleteProduit: (id) => request(`/api/produits/${id}/`, { method: 'DELETE' }),

  /** GET /api/utilisateurs/ — pour alimenter le champ « vendeur » */
  utilisateurs: () => request('/api/utilisateurs/'),
}

/** Formate un prix : 1000 → « 1 000 FCFA » */
export function formatPrix(valeur) {
  const n = Number(valeur ?? 0)
  return `${new Intl.NumberFormat('fr-FR').format(n)} FCFA`
}

/** Date inconnue du modèle : on affiche la référence tronquée à la place. */
export function referenceCourte(id) {
  return String(id ?? '').slice(0, 8).toUpperCase()
}
