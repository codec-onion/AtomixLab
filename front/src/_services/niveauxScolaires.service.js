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
