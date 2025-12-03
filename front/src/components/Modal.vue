<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-backdrop" @mousedown="handleBackdropClick">
        <div class="modal-container" @mousedown.stop role="dialog" aria-modal="true" :aria-labelledby="titleId">
          <!-- Header with close button -->
          <div class="modal-header">
            <h3 v-if="title" :id="titleId" class="modal-title">{{ title }}</h3>
            <button
              class="modal-close"
              @click="closeModal"
              aria-label="Fermer la modal"
              type="button"
            >
              <font-awesome-icon icon="fa-solid fa-xmark" />
            </button>
          </div>

          <!-- Content slot -->
          <div class="modal-body">
            <slot></slot>
          </div>

          <!-- Optional footer slot -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, computed, onUnmounted, ref } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

// Generate unique ID for accessibility
const titleId = computed(() => `modal-title-${Math.random().toString(36).substring(2, 9)}`)

// Close modal handler
const closeModal = () => {
  emit('close')
}

// Handle backdrop click - ONLY close if BOTH mousedown AND mouseup were on backdrop
const handleBackdropClick = (event) => {
  if (props.closeOnBackdrop) {
    closeModal()
  }
}

// Handle ESC key press
const handleEscape = (event) => {
  if (event.key === 'Escape' && props.closeOnEscape && props.isOpen) {
    closeModal()
  }
}

// Manage body scroll lock and ESC listener
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    // Lock body scroll when modal opens
    document.body.style.overflow = 'hidden'

    // Add ESC key listener
    if (props.closeOnEscape) {
      document.addEventListener('keydown', handleEscape)
    }
  } else {
    // Unlock body scroll when modal closes
    document.body.style.overflow = ''

    // Remove ESC key listener
    document.removeEventListener('keydown', handleEscape)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
/* Backdrop overlay */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

/* Modal container */
.modal-container {
  background-color: var(--color-tertiary);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-title {
  margin: 0;
  font-family: var(--font-family-title1_2);
  font-size: var(--font-size-title4-desktop);
  color: var(--color-secondary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  color: var(--color-secondary);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s;
}

.modal-close:hover {
  background-color: var(--color-primary);
  color: var(--color-icons);
}

/* Body */
.modal-body {
  padding: 30px;
}

/* Footer */
.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid #e0e0e0;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    margin: 20px;
  }

  .modal-title {
    font-size: var(--font-size-title4-mobile);
  }

  .modal-body {
    padding: 20px;
  }
}
</style>
