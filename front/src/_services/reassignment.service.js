import Axios from './axios'

/**
 * Obtenir les cours dépendants d'une ressource
 * @param {string} resourceType - 'session', 'niveauScolaire', ou 'thematique'
 * @param {string} id - ID de la ressource
 * @returns {Promise<Object>} {count, data: [cours]}
 */
export const getDependentCourses = async (resourceType, id) => {
  try {
    const res = await Axios.get(`/reassignment/${resourceType}/${id}/dependencies`)
    return res.data
  } catch (error) {
    console.error('Erreur lors de la récupération des dépendances:', error)
    throw error
  }
}

/**
 * Réassigner les cours et supprimer l'ancienne ressource
 * @param {string} resourceType - 'session', 'niveauScolaire', ou 'thematique'
 * @param {string} oldId - ID de la ressource à supprimer
 * @param {string} newId - ID de la nouvelle ressource
 * @returns {Promise<Object>} Résultat de l'opération
 */
export const reassignAndDelete = async (resourceType, oldId, newId) => {
  try {
    const res = await Axios.post(`/reassignment/${resourceType}/${oldId}/reassign`, { newId })
    return res.data
  } catch (error) {
    console.error('Erreur lors de la réassignation:', error)
    throw error
  }
}
