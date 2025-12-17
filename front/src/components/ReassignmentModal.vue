<template>
  <Modal
    :isOpen="isOpen"
    :title="modalTitle"
    @close="handleClose"
    :closeOnBackdrop="false"
  >
    <div class="reassignment-container">
      <!-- Message d'avertissement -->
      <div class="warning-box">
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" class="warning-icon" />
        <p class="warning-message">
          Impossible de supprimer "<strong>{{ itemToDelete?.name }}</strong>" car
          <strong>{{ dependentCourses.length }} cours</strong> y sont associés.
        </p>
      </div>

      <!-- Formulaire de réassignation -->
      <div class="form-section">
        <label class="form-label">
          Réassigner les cours vers :
        </label>
        <select
          v-model="selectedNewId"
          class="reassignment-select"
          :disabled="isProcessing"
        >
          <option value="">-- Sélectionner une nouvelle valeur --</option>
          <option
            v-for="option in availableOptions"
            :key="option._id"
            :value="option._id"
          >
            {{ option.name }}
          </option>
        </select>
      </div>

      <!-- Liste des cours concernés -->
      <div class="courses-section">
        <h4 class="courses-title">Cours concernés ({{ dependentCourses.length }}) :</h4>
        <div class="courses-list">
          <div
            v-for="course in dependentCourses"
            :key="course._id"
            class="course-item"
          >
            <font-awesome-icon
              :icon="course.type === 'Chimie' ? 'flask-vial' : 'fa-solid fa-explosion'"
              class="course-icon"
            />
            <span class="course-title">{{ course.title }}</span>
            <span class="course-type">{{ course.type }}</span>
          </div>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>

    <!-- Footer avec boutons -->
    <template #footer>
      <div class="modal-footer">
        <button
          type="button"
          @click="handleReassign"
          :disabled="!selectedNewId || isProcessing"
          class="btn-confirm"
        >
          {{ isProcessing ? 'Réassignation en cours...' : 'Réassigner et supprimer' }}
        </button>
        <button
          type="button"
          @click="handleClose"
          :disabled="isProcessing"
          class="btn-cancel"
        >
          Annuler
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed } from 'vue'
import Modal from './Modal.vue'
import { reassignAndDelete } from '@/_services/reassignment.service'
import { useDonnesStore } from '@/stores/donnes'
import { useFiltersStore } from '@/stores/filters'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  resourceType: {
    type: String,
    required: true,
    validator: (value) => ['session', 'niveauScolaire', 'thematique'].includes(value)
  },
  itemToDelete: {
    type: Object, // {_id, name}
    default: null
  },
  dependentCourses: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'success'])

const donneesStore = useDonnesStore()
const filtersStore = useFiltersStore()

// État
const selectedNewId = ref('')
const isProcessing = ref(false)
const error = ref('')

// Computed
const modalTitle = computed(() => {
  const labels = {
    session: 'la session',
    niveauScolaire: 'le niveau scolaire',
    thematique: 'la thématique'
  }
  return `Réassigner les cours de ${labels[props.resourceType]}`
})

const availableOptions = computed(() => {
  let options = []

  switch (props.resourceType) {
    case 'session':
      options = filtersStore.sessions
      break
    case 'niveauScolaire':
      options = filtersStore.niveauxScolaires
      break
    case 'thematique':
      options = filtersStore.thematiques
      break
  }

  // Exclure l'élément à supprimer
  return options.filter(opt => opt._id !== props.itemToDelete?._id)
})

// Méthodes
const handleReassign = async () => {
  if (!selectedNewId.value) return

  isProcessing.value = true
  error.value = ''

  try {
    await reassignAndDelete(
      props.resourceType,
      props.itemToDelete._id,
      selectedNewId.value
    )

    // Mettre à jour le store
    switch (props.resourceType) {
      case 'session':
        filtersStore.deleteSession(props.itemToDelete._id)
        break
      case 'niveauScolaire':
        filtersStore.deleteNiveauScolaire(props.itemToDelete._id)
        break
      case 'thematique':
        filtersStore.deleteThematique(props.itemToDelete._id)
        break
    }

    // Recharger les cours pour avoir les données à jour
    await donneesStore.loadCours(filtersStore.sessionFilter)

    emit('success')
  } catch (err) {
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Erreur lors de la réassignation'
    }
    console.error('Erreur réassignation:', err)
  } finally {
    isProcessing.value = false
  }
}

const handleClose = () => {
  if (!isProcessing.value) {
    selectedNewId.value = ''
    error.value = ''
    emit('close')
  }
}
</script>

<style scoped>
.reassignment-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Warning box */
.warning-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  background-color: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  align-items: flex-start;
}

.warning-icon {
  color: #856404;
  font-size: 24px;
  flex-shrink: 0;
}

.warning-message {
  margin: 0;
  color: #856404;
  font-family: var(--font-family-title3_4_text);
  font-size: 14px;
  line-height: 1.5;
}

/* Form section */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-family: var(--font-family-title3_4_text);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-secondary);
}

.reassignment-select {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  font-family: var(--font-family-title3_4_text);
  font-size: var(--font-size-text-primary-desktop);
  background-color: white;
  color: var(--color-secondary);
  cursor: pointer;
  transition: border-color 0.2s;
}

.reassignment-select:focus {
  outline: none;
  border-color: var(--color-icons);
  box-shadow: 0 0 0 3px rgba(38, 170, 226, 0.1);
}

.reassignment-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Courses section */
.courses-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.courses-title {
  margin: 0;
  font-family: var(--font-family-title3_4_text);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-secondary);
}

.courses-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px;
}

.course-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-family: var(--font-family-title3_4_text);
  font-size: 14px;
}

.course-item:last-child {
  border-bottom: none;
}

.course-icon {
  color: var(--color-icons);
  font-size: 16px;
  flex-shrink: 0;
}

.course-title {
  flex: 1;
  color: var(--color-secondary);
}

.course-type {
  font-size: 12px;
  color: #6c757d;
  font-style: italic;
}

/* Error message */
.error-message {
  padding: 12px;
  background-color: #f8d7da;
  border: 1px solid #f5c2c7;
  border-radius: 8px;
  color: #842029;
  font-family: var(--font-family-title3_4_text);
  font-size: 14px;
}

/* Footer */
.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-confirm,
.btn-cancel {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-family: var(--font-family-title3_4_text);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm {
  background-color: var(--color-secondary);
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background-color: var(--color-icons);
}

.btn-confirm:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
