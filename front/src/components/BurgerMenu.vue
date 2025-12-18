<template>
  <div class="burger-menu-container">
    <!-- Bouton hamburger -->
    <button
      @click="toggleMenu"
      class="burger-button"
      :class="{ 'open': isOpen }"
      aria-label="Menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Overlay -->
    <Transition name="overlay-fade">
      <div
        v-if="isOpen"
        class="overlay"
        @click="closeMenu"
      ></div>
    </Transition>

    <!-- Menu déroulant -->
    <Transition name="slide">
      <nav v-if="isOpen" class="menu-panel">
        <div class="menu-content">
          <!-- Si non authentifié -->
          <div v-if="!authStore.isAuthenticated" class="menu-section">
            <a
              href="#"
              @click.prevent="handleLoginClick"
              class="menu-link"
            >
              <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
              <span>Connexion</span>
            </a>
          </div>

          <!-- Si authentifié -->
          <div v-else class="menu-section">
            <div class="user-info">
              <font-awesome-icon icon="fa-solid fa-user-circle" class="user-icon" />
              <span class="user-name">{{ authStore.userName }}</span>
              <span v-if="authStore.isAdmin" class="admin-badge">Admin</span>
            </div>

            <a
              href="#"
              @click.prevent="handleLogoutClick"
              class="menu-link logout"
            >
              <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
              <span>Déconnexion</span>
            </a>
          </div>
        </div>
      </nav>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isOpen = ref(false)

const emit = defineEmits(['login', 'logout'])

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const handleLoginClick = () => {
  closeMenu()
  emit('login')
}

const handleLogoutClick = () => {
  closeMenu()
  emit('logout')
}
</script>

<style scoped>
.burger-menu-container {
  position: relative;
  z-index: 1000;
}

/* Bouton hamburger */
.burger-button {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1002;
  position: relative;
}

.burger-button span {
  width: 100%;
  height: 3px;
  background-color: var(--color-secondary);
  border-radius: 10px;
  transition: all 0.3s ease;
  transform-origin: center;
}

/* Animation du bouton en X */
.burger-button.open span:nth-child(1) {
  transform: translateY(10px) rotate(45deg);
}

.burger-button.open span:nth-child(2) {
  opacity: 0;
  transform: translateX(-20px);
}

.burger-button.open span:nth-child(3) {
  transform: translateY(-10px) rotate(-45deg);
}

/* Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* Menu panel */
.menu-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background-color: var(--color-tertiary);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  overflow-y: auto;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Contenu du menu */
.menu-content {
  padding: 80px 20px 20px 20px;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* User info */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background-color: var(--color-primary);
  border-radius: 12px;
  margin-bottom: 10px;
}

.user-icon {
  font-size: 48px;
  color: var(--color-secondary);
}

.user-name {
  font-size: var(--font-size-text-primary-desktop);
  font-weight: 600;
  color: var(--color-secondary);
  text-align: center;
}

.admin-badge {
  font-size: var(--font-size-text-secondary-desktop);
  padding: 4px 12px;
  background-color: var(--color-icons);
  color: white;
  border-radius: 12px;
  font-weight: 600;
}

/* Menu links */
.menu-link {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  text-decoration: none;
  color: var(--color-secondary);
  font-size: var(--font-size-text-primary-desktop);
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
  background-color: var(--color-primary);
}

.menu-link:hover {
  background-color: var(--color-secondary);
  color: var(--color-tertiary);
  transform: translateX(-5px);
}

.menu-link svg {
  font-size: 20px;
  width: 20px;
}

.menu-link.logout {
  background-color: #ff6b6b;
  color: white;
}

.menu-link.logout:hover {
  background-color: #ff5252;
}

/* Responsive */
@media (max-width: 768px) {
  .menu-panel {
    width: 85%;
    max-width: 320px;
  }

  .user-name {
    font-size: var(--font-size-text-primary-mobile);
  }

  .admin-badge {
    font-size: var(--font-size-text-secondary-mobile);
  }

  .menu-link {
    font-size: var(--font-size-text-primary-mobile);
  }
}
</style>
