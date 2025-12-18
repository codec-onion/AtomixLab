<template>
  <div class="delete-cours-container">
    <div class="warning-icon">
      <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />
    </div>

    <p class="message">
      Êtes-vous sûr de vouloir supprimer ce cours ?
    </p>

    <div v-if="courseInfo" class="course-details">
      <p><strong>{{ courseInfo.title }}</strong></p>
      <p class="course-meta">
        {{ courseInfo.niveauScolaire }} • {{ courseInfo.session }}
      </p>
      <p class="course-meta">{{ courseInfo.thematique }}</p>
    </div>

    <p class="warning-text">
      Cette action est irréversible.
    </p>

    <div class="actions">
      <button @click="handleCancel" class="btn btn-cancel" type="button">
        Annuler
      </button>
      <button @click="handleConfirm" class="btn btn-delete" type="button" :disabled="isDeleting">
        {{ isDeleting ? 'Suppression...' : 'Supprimer' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  courseInfo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['cancel', 'confirm'])

const isDeleting = ref(false)

const handleCancel = () => {
  emit('cancel')
}

const handleConfirm = async () => {
  isDeleting.value = true
  try {
    await emit('confirm')
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.delete-cours-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
}

.warning-icon {
  font-size: 64px;
  color: #ff6b6b;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.message {
  font-size: var(--font-size-text-primary-desktop);
  color: var(--color-secondary);
  font-weight: 600;
  text-align: center;
  margin: 0;
}

.course-details {
  background-color: var(--color-primary);
  padding: 15px 20px;
  border-radius: 8px;
  width: 100%;
  text-align: center;
}

.course-details p {
  margin: 5px 0;
  color: var(--color-secondary);
}

.course-details strong {
  font-size: var(--font-size-text-primary-desktop);
}

.course-meta {
  font-size: var(--font-size-text-secondary-desktop);
  color: var(--color-icons);
}

.warning-text {
  font-size: var(--font-size-text-secondary-desktop);
  color: #ff6b6b;
  font-style: italic;
  margin: 0;
}

.actions {
  display: flex;
  gap: 15px;
  width: 100%;
  margin-top: 10px;
}

.btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: var(--font-size-text-primary-desktop);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: var(--color-primary);
  color: var(--color-secondary);
  border: 2px solid var(--color-secondary);
}

.btn-cancel:hover:not(:disabled) {
  background-color: var(--color-secondary);
  color: var(--color-tertiary);
}

.btn-delete {
  background-color: #ff6b6b;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background-color: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
}

@media (max-width: 768px) {
  .warning-icon {
    font-size: 48px;
  }

  .message {
    font-size: var(--font-size-text-primary-mobile);
  }

  .course-details strong {
    font-size: var(--font-size-text-primary-mobile);
  }

  .course-meta {
    font-size: var(--font-size-text-secondary-mobile);
  }

  .warning-text {
    font-size: var(--font-size-text-secondary-mobile);
  }

  .btn {
    font-size: var(--font-size-text-primary-mobile);
    padding: 10px 20px;
  }
}
</style>
