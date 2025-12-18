<template>
  <header class="flexbox_usual">
    <span id="header_title">AtomixLab</span>
    <span id="header_icons">
      <BurgerMenu
        @login="openLoginModal"
        @logout="handleLogout"
      />
      <font-awesome-icon icon="fa-solid fa-explosion" />
      <font-awesome-icon icon="flask-vial" />

      <!-- Menu burger -->
    </span>
  </header>

  <!-- Login Modal -->
  <Modal
    :isOpen="isLoginModalOpen"
    title="Connexion"
    @close="closeLoginModal"
  >
    <LoginForm @success="handleLoginSuccess" />
  </Modal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Modal from './Modal.vue'
import LoginForm from './LoginForm.vue'
import BurgerMenu from './BurgerMenu.vue'

const authStore = useAuthStore()
const isLoginModalOpen = ref(false)

// Initialize auth on mount
onMounted(async () => {
  await authStore.initAuth()
})

// Open login modal
const openLoginModal = () => {
  isLoginModalOpen.value = true
}

// Close login modal
const closeLoginModal = () => {
  isLoginModalOpen.value = false
  // Clear any errors when closing
  authStore.clearError()
}

// Handle successful login
const handleLoginSuccess = () => {
  closeLoginModal()
  console.log('Connexion réussie!')
}

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
  console.log('Déconnexion réussie!')
}
</script>

<style scoped>
header {
  width: 100%;
  padding: 10px;
  margin-bottom: 50px;
  background-color: var(--color-primary);
}

#header_title, #header_icons {
  font-size: var(--font-size-title1-desktop);
}

#header_title {
  font-weight: var(--font-weight-title1_3-desktop);
  font-family: var(--font-family-title1_2);
  color: var(--color-secondary);
}

#header_icons {
  color: var(--color-icons);
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  #header_title {
    font-size: var(--font-size-title1-mobile);
  }

  #header_icons {
    font-size: 24px;
  }
}
</style>
