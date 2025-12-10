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

/**
 * Crée une nouvelle thématique (admin seulement)
 * @param {Object} data - {name: string, description?: string}
 * @returns {Promise<Object>} Thématique créée avec {_id, name, description}
 */
export const createThematique = async (data) => {
  try {
    const res = await Axios.post('/thematiques', data)
    return res.data.data
  } catch (error) {
    console.error('Erreur lors de la création de la thématique:', error)
    throw error
  }
}

/**
 * Met à jour une thématique (admin seulement)
 * @param {string} id - ID de la thématique
 * @param {Object} data - {name: string, description?: string}
 * @returns {Promise<Object>} Thématique mise à jour avec {_id, name, description}
 */
export const updateThematique = async (id, data) => {
  try {
    const res = await Axios.put(`/thematiques/${id}`, data)
    return res.data.data
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la thématique:', error)
    throw error
  }
}

/**
 * Supprime une thématique (admin seulement)
 * @param {string} id - ID de la thématique
 * @returns {Promise<Object>} Réponse de confirmation {success, message}
 */
export const deleteThematique = async (id) => {
  try {
    const res = await Axios.delete(`/thematiques/${id}`)
    return res.data
  } catch (error) {
    console.error('Erreur lors de la suppression de la thématique:', error)
    throw error
  }
}
