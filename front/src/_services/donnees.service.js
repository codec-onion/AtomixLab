import Axios from './axios'

// Récupérer tous les cours (avec filtres optionnels)
// Note: niveauScolaire et thématique sont filtrés côté client
export const getCours = async (filters = {}) => {
  try {
    const params = new URLSearchParams()

    // UNIQUEMENT envoyer le filtre session au backend
    if (filters.session) params.append('session', filters.session)

    // Conserver search et type pour usage futur
    if (filters.type) params.append('type', filters.type)
    if (filters.search) params.append('search', filters.search)

    const queryString = params.toString()
    const url = queryString ? `/courses?${queryString}` : '/courses'

    const res = await Axios.get(url)
    return res.data.data
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error)
    throw error
  }
}

// Récupérer un cours par ID
export const getCoursByID = async (id) => {
  try {
    const res = await Axios.get(`/courses/${id}`)
    return res.data.data
  } catch (error) {
    console.error('Erreur lors de la récupération du cours:', error)
    throw error
  }
}

// Créer un nouveau cours (admin seulement)
export const createCours = async (courseData) => {
  try {
    const res = await Axios.post('/courses', courseData)
    return res.data.data
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error)
    throw error
  }
}

// Mettre à jour un cours (admin seulement)
export const updateCours = async (id, courseData) => {
  try {
    const res = await Axios.put(`/courses/${id}`, courseData)
    return res.data.data
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cours:', error)
    throw error
  }
}

// Supprimer un cours (admin seulement)
export const deleteCours = async (id) => {
  try {
    const res = await Axios.delete(`/courses/${id}`)
    return res.data
  } catch (error) {
    console.error('Erreur lors de la suppression du cours:', error)
    throw error
  }
}