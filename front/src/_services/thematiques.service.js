import Axios from './axios'

/**
 * Récupère toutes les thématiques
 * @returns {Promise<Array>} Liste des thématiques avec {_id, name, description}
 */
export const getThematiques = async () => {
  try {
    const res = await Axios.get('/thematiques')
    return res.data.data
  } catch (error) {
    console.error('Erreur lors de la récupération des thématiques:', error)
    throw error
  }
}

/**
 * Récupère une thématique par son ID
 * @param {string} id - ID de la thématique
 * @returns {Promise<Object>} Thématique avec {_id, name, description}
 */
export const getThematiqueById = async (id) => {
  try {
    const res = await Axios.get(`/thematiques/${id}`)
    return res.data.data
  } catch (error) {
    console.error('Erreur lors de la récupération de la thématique:', error)
    throw error
  }
}
