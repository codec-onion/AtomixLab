import Axios from './axios'

// Inscription d'un nouvel utilisateur
export const register = async (email, password, role = 'user') => {
  try {
    const res = await Axios.post('/auth/register', {
      email,
      password,
      role,
    })

    // Sauvegarder le token dans le localStorage
    if (res.data.success && res.data.data.token) {
      localStorage.setItem('token', res.data.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.data.user))
    }

    return res.data
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    throw error
  }
}

// Connexion d'un utilisateur
export const login = async (email, password) => {
  try {
    const res = await Axios.post('/auth/login', {
      email,
      password,
    })

    // Sauvegarder le token dans le localStorage
    if (res.data.success && res.data.data.token) {
      localStorage.setItem('token', res.data.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.data.user))
    }

    return res.data
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    throw error
  }
}

// Déconnexion
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Récupérer l'utilisateur actuel
export const getCurrentUser = async () => {
  try {
    const res = await Axios.get('/auth/me')
    return res.data.data
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error)
    throw error
  }
}

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

// Récupérer l'utilisateur du localStorage
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

// Vérifier si l'utilisateur est admin
export const isAdmin = () => {
  const user = getStoredUser()
  return user && user.role === 'admin'
}
