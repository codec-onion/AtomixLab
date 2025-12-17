<template>
  <header class="flexbox_usual">
    <span id="header_title">AtomixLab</span>
    <span id="header_icons">
      <!-- Show login button if not authenticated -->
      <a
        v-if="!authStore.isAuthenticated"
        href="#"
        @click.prevent="openLoginModal"
        class="connexion-link"
      >
        Connexion
      </a>

      <!-- Show user info and logout if authenticated -->
      <div v-else class="user-menu">
        <span class="user-name">{{ authStore.userName }}</span>
        <a
          href="#"
          @click.prevent="handleLogout"
          class="logout-link"
        >
          Déconnexion
        </a>
      </div>

      <font-awesome-icon icon="fa-solid fa-explosion" />
      <font-awesome-icon icon="flask-vial" />
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

/* Link styles */
a {
  font-size: var(--font-size-text-primary-desktop);
  text-decoration: none;
  color: var(--color-secondary);
  transition: color 0.2s;
}

a:hover {
  color: var(--color-icons);
}

/* User menu */
.user-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.user-name {
  font-size: var(--font-size-text-secondary-desktop);
  font-family: var(--font-family-title3_4_text);
  color: var(--color-secondary);
  font-weight: 600;
}

.logout-link {
  font-size: var(--font-size-text-secondary-desktop);
}

/* Responsive */
@media (max-width: 768px) {
  #header_title {
    font-size: var(--font-size-title1-mobile);
  }

  #header_icons {
    font-size: 24px;
  }

  a {
    font-size: var(--font-size-text-primary-mobile);
  }

  .user-name,
  .logout-link {
    font-size: var(--font-size-text-secondary-mobile);
  }
}
</style>
