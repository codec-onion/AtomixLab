import axios from 'axios'
import router from '@/router'

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

// Intercepteur pour ajouter le token JWT aux requêtes
Axios.interceptors.request.use((request) => {
  const token = localStorage.getItem('token')
  if (token) {
    request.headers.Authorization = 'Bearer ' + token
  }
  return request
})

// Intercepteur pour gérer les erreurs d'authentification
Axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      return Promise.reject(error.response)
    } else {
      return Promise.reject(error.response || error)
    }
  }
)

export default Axios
