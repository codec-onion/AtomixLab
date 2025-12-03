import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  login as loginService,
  logout as logoutService,
  isAuthenticated as checkAuth,
  getStoredUser,
  getCurrentUser,
  isAdmin as checkAdmin
} from '@/_services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  // State
  const currentUser = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const isInitialized = ref(false)

  // Computed getters
  const isAuthenticated = computed(() => {
    return currentUser.value !== null && checkAuth()
  })

  const userName = computed(() => {
    return currentUser.value?.email?.split('@')[0] || 'Utilisateur'
  })

  const userRole = computed(() => {
    return currentUser.value?.role || 'user'
  })

  const isAdmin = computed(() => {
    return userRole.value === 'admin'
  })

  // Actions

  /**
   * Initialize auth state from localStorage
   * Called on app startup
   */
  async function initAuth() {
    if (isInitialized.value) return

    try {
      // Check if token exists
      if (checkAuth()) {
        // Try to get user from localStorage first
        const storedUser = getStoredUser()

        if (storedUser) {
          currentUser.value = storedUser
        } else {
          // If no stored user, fetch from API to verify token
          try {
            const user = await getCurrentUser()
            currentUser.value = user
          } catch (err) {
            // Token invalid, clear everything
            await logout()
          }
        }
      }
    } catch (err) {
      console.error('Erreur initialisation auth:', err)
      error.value = 'Erreur lors de l\'initialisation'
    } finally {
      isInitialized.value = true
    }
  }

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   */
  async function login(email, password) {
    isLoading.value = true
    error.value = null

    try {
      // Call auth service
      const response = await loginService(email, password)

      // Service already saves token and user to localStorage
      // Update store state
      currentUser.value = response.data.user

      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur de connexion'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout current user
   */
  async function logout() {
    isLoading.value = true
    error.value = null

    try {
      // Call auth service to clear localStorage
      logoutService()

      // Clear store state
      currentUser.value = null
    } catch (err) {
      error.value = 'Erreur lors de la déconnexion'
      console.error('Logout error:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Refresh current user data from API
   */
  async function refreshUser() {
    if (!checkAuth()) {
      currentUser.value = null
      return
    }

    try {
      const user = await getCurrentUser()
      currentUser.value = user
    } catch (err) {
      console.error('Erreur refresh user:', err)
      // If refresh fails, logout
      await logout()
    }
  }

  /**
   * Clear error state
   */
  function clearError() {
    error.value = null
  }

  return {
    // State
    currentUser,
    isLoading,
    error,
    isInitialized,

    // Computed
    isAuthenticated,
    userName,
    userRole,
    isAdmin,

    // Actions
    initAuth,
    login,
    logout,
    refreshUser,
    clearError
  }
})
