import Axios from './axios'

/**
 * Récupère tous les niveaux scolaires
 * @returns {Promise<Array>} Liste des niveaux scolaires avec {_id, name, description}
 */
export const getNiveauxScolaires = async () => {
  try {
    const res = await Axios.get('/niveaux-scolaires')
    return res.data.data
  } catch (error) {
    console.error('Erreur lors de la récupération des niveaux scolaires:', error)
    throw error
  }
}

/**
 * Récupère un niveau scolaire par son ID
 * @param {string} id - ID du niveau scolaire
 * @returns {Promise<Object>} Niveau scolaire avec {_id, name, description}
 */
export const getNiveauScolaireById = async (id) => {
  try {
    const res = await Axios.get(`/niveaux-scolaires/${id}`)
    return res.data.data
  } catch (error) {
    console.error('Erreur lors de la récupération du niveau scolaire:', error)
    throw error
  }
}

/**
 * Crée un nouveau niveau scolaire (admin seulement)
 * @param {Object} data - {name: string, description?: string}
 * @returns {Promise<Object>} Niveau scolaire créé avec {_id, name, description}
 */
export const createNiveauScolaire = async (data) => {
  try {
    const res = await Axios.post('/niveaux-scolaires', data)
    return res.data.data
  } catch (error) {
    console.error('Erreur lors de la création du niveau scolaire:', error)
    throw error
  }
}

/**
 * Met à jour un niveau scolaire (admin seulement)
 * @param {string} id - ID du niveau scolaire
 * @param {Object} data - {name: string, description?: string}
 * @returns {Promise<Object>} Niveau scolaire mis à jour avec {_id, name, description}
 */
export const updateNiveauScolaire = async (id, data) => {
  try {
    const res = await Axios.put(`/niveaux-scolaires/${id}`, data)
    return res.data.data
  } catch (error) {
    console.error('Erreur lors de la mise à jour du niveau scolaire:', error)
    throw error
  }
}

/**
 * Supprime un niveau scolaire (admin seulement)
 * @param {string} id - ID du niveau scolaire
 * @returns {Promise<Object>} Réponse de confirmation {success, message}
 */
export const deleteNiveauScolaire = async (id) => {
  try {
    const res = await Axios.delete(`/niveaux-scolaires/${id}`)
    return res.data
  } catch (error) {
    console.error('Erreur lors de la suppression du niveau scolaire:', error)
    throw error
  }
}
