<template>
  <form @submit.prevent="handleSubmit" class="login-form">
    <!-- Email field -->
    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="formData.email"
        type="email"
        placeholder="votre@email.com"
        required
        autocomplete="email"
        :disabled="isLoading"
        @blur="validateEmail"
      />
      <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
    </div>

    <!-- Password field -->
    <div class="form-group">
      <label for="password">Mot de passe</label>
      <div class="password-wrapper">
        <input
          id="password"
          v-model="formData.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          required
          autocomplete="current-password"
          :disabled="isLoading"
          minlength="6"
        />
        <button
          type="button"
          class="toggle-password"
          @click="showPassword = !showPassword"
          :disabled="isLoading"
          aria-label="Afficher/masquer le mot de passe"
        >
          <font-awesome-icon :icon="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" />
        </button>
      </div>
      <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
    </div>

    <!-- Global error message -->
    <div v-if="errors.global" class="error-banner">
      <font-awesome-icon icon="fa-solid fa-circle-exclamation" />
      <span>{{ errors.global }}</span>
    </div>

    <!-- Submit button -->
    <button
      type="submit"
      class="submit-button"
      :disabled="isLoading || !isFormValid"
    >
      <span v-if="!isLoading">Se connecter</span>
      <span v-else class="loading-spinner">
        <font-awesome-icon icon="fa-solid fa-spinner" spin />
        Connexion...
      </span>
    </button>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const emit = defineEmits(['success'])

// Form data
const formData = reactive({
  email: '',
  password: ''
})

// UI state
const showPassword = ref(false)
const isLoading = computed(() => authStore.isLoading)

// Validation errors
const errors = reactive({
  email: '',
  password: '',
  global: ''
})

// Email validation
const validateEmail = () => {
  errors.email = ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email) {
    errors.email = 'L\'email est requis'
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Format d\'email invalide'
  }
}

// Form validation
const isFormValid = computed(() => {
  return formData.email.length > 0 &&
         formData.password.length >= 6 &&
         !errors.email &&
         !errors.password
})

// Submit handler
const handleSubmit = async () => {
  // Clear previous errors
  errors.email = ''
  errors.password = ''
  errors.global = ''

  // Validate email
  validateEmail()
  if (errors.email) return

  // Validate password length
  if (formData.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }

  try {
    // Call auth store login action
    await authStore.login(formData.email, formData.password)

    // Emit success event to close modal
    emit('success')

    // Reset form
    formData.email = ''
    formData.password = ''
  } catch (error) {
    // Handle different error types
    if (error.response?.status === 401) {
      errors.global = 'Email ou mot de passe incorrect'
    } else if (error.response?.status === 404) {
      errors.global = 'Utilisateur non trouvé'
    } else if (error.message === 'Network Error') {
      errors.global = 'Erreur de connexion au serveur'
    } else {
      errors.global = error.response?.data?.message || 'Une erreur est survenue'
    }
  }
}
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Form groups */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-family: var(--font-family-title3_4_text);
  font-size: var(--font-size-text-primary-desktop);
  color: var(--color-secondary);
  font-weight: 600;
}

input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: var(--font-family-title3_4_text);
  font-size: var(--font-size-text-secondary-desktop);
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  outline: none;
  border-color: var(--color-icons);
  box-shadow: 0 0 0 3px rgba(38, 170, 226, 0.1);
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

/* Password field with toggle */
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  flex: 1;
  padding-right: 45px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--color-secondary);
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  transition: color 0.2s;
}

.toggle-password:hover:not(:disabled) {
  color: var(--color-icons);
}

.toggle-password:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Error messages */
.error-message {
  font-size: 14px;
  color: #e74c3c;
  font-family: var(--font-family-title3_4_text);
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  font-family: var(--font-family-title3_4_text);
  font-size: var(--font-size-text-secondary-desktop);
}

/* Submit button */
.submit-button {
  padding: 14px 24px;
  background-color: var(--color-secondary);
  color: white;
  border: none;
  border-radius: 8px;
  font-family: var(--font-family-title3_4_text);
  font-size: var(--font-size-text-primary-desktop);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  margin-top: 10px;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--color-icons);
  transform: translateY(-1px);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  label {
    font-size: var(--font-size-text-primary-mobile);
  }

  input {
    font-size: var(--font-size-text-secondary-mobile);
  }

  .submit-button {
    font-size: var(--font-size-text-primary-mobile);
  }
}
</style>
