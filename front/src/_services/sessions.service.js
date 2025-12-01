import Axios from './axios'

/**
 * Récupère toutes les sessions
 * @returns {Promise<Array>} Liste des sessions avec {_id, name, description}
 */
export const getSessions = async () => {
  try {
    const res = await Axios.get('/sessions')
    return res.data.data
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error)
    throw error
  }
}

/**
 * Récupère une session par son ID
 * @param {string} id - ID de la session
 * @returns {Promise<Object>} Session avec {_id, name, description}
 */
export const getSessionById = async (id) => {
  try {
    const res = await Axios.get(`/sessions/${id}`)
    return res.data.data
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error)
    throw error
  }
}
