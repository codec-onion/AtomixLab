import axios from 'axios'
import router from '@/router'

const Axios = axios.create({
  baseURL: 'http://localhost:5173',
})

// Axios.interceptors.request.use((request) => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     request.headers.Authorization = 'Bearer ' + token
//   }
//   return request
// })

// Axios.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   (error) => {
//     if (error.response.status == 401) {
//       localStorage.removeItem('token')
//       router.push('/login')
//       return Promise.reject(error.response)
//     } else {
//       return Promise.reject(error.response)
//     }
//   }
// )

export default Axios
