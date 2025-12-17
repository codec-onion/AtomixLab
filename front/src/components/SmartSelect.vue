<template>
  <div class="smart-select" ref="smartSelectRef">
    <!-- Mode normal : Liste personnalisée -->
    <div class="custom-select" v-if="!isAdding && !isEditing && !showDeleteConfirm">
      <button
        type="button"
        class="select-trigger"
        @click="toggleDropdown"
        :disabled="disabled"
      >
        {{ selectedLabel || placeholder }}
        <font-awesome-icon
          class="dropdown-icon"
          icon="fa-solid fa-circle-chevron-down"
        />
      </button>

      <div v-if="isOpen" class="options-list">
        <div
          v-for="option in options"
          :key="option._id"
          class="option-item"
          @click="selectOption(option._id)"
        >
          <span class="option-name">{{ option.name }}</span>
          <div v-if="authStore.isAdmin" class="option-actions">
            <button
              type="button"
              class="btn-edit-inline"
              @click.stop="startEdit(option)"
              title="Modifier"
            >
              <font-awesome-icon icon="fa-solid fa-pen" />
            </button>
            <button
              type="button"
              class="btn-delete-inline"
              @click.stop="confirmDelete(option)"
              title="Supprimer"
            >
              <font-awesome-icon icon="fa-solid fa-trash" />
            </button>
          </div>
        </div>

        <div v-if="authStore.isAdmin" class="option-item add-new" @click="startAdd">
          <span>➕ Ajouter nouveau...</span>
        </div>
      </div>
    </div>

    <!-- Mode ajout : Formulaire inline -->
    <div v-if="isAdding" class="add-form">
      <input
        ref="addInput"
        v-model="newItemName"
        type="text"
        :placeholder="`Nom de ${labelSingular}`"
        @keyup.enter="handleAdd"
        @keyup.esc="cancelAdd"
        class="add-input"
      />
      <button
        type="button"
        @click="handleAdd"
        :disabled="!newItemName.trim() || isCreating"
        class="btn-confirm"
      >
        <font-awesome-icon
          :icon="isCreating ? 'fa-solid fa-spinner' : 'fa-solid fa-check'"
          :spin="isCreating"
        />
      </button>
      <button
        type="button"
        @click="cancelAdd"
        class="btn-cancel"
        :disabled="isCreating"
      >
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </button>
    </div>

    <!-- Mode édition -->
    <div v-if="isEditing" class="edit-form">
      <input
        ref="editInput"
        v-model="editingItemName"
        type="text"
        :placeholder="`Nom de ${labelSingular}`"
        @keyup.enter="handleUpdate"
        @keyup.esc="cancelEdit"
        class="edit-input"
      />
      <button
        type="button"
        @click="handleUpdate"
        :disabled="!editingItemName.trim() || isUpdating"
        class="btn-confirm"
      >
        <font-awesome-icon
          :icon="isUpdating ? 'fa-solid fa-spinner' : 'fa-solid fa-check'"
          :spin="isUpdating"
        />
      </button>
      <button
        type="button"
        @click="cancelEdit"
        class="btn-cancel"
        :disabled="isUpdating"
      >
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </button>
    </div>

    <!-- Confirmation de suppression -->
    <div v-if="showDeleteConfirm" class="delete-confirm">
      <p class="confirm-message">
        Êtes-vous sûr de vouloir supprimer "<strong>{{ deletingItemName }}</strong>" ?
      </p>
      <div class="confirm-actions">
        <button
          type="button"
          @click="handleDelete"
          :disabled="isDeleting"
          class="btn-confirm-delete"
        >
          {{ isDeleting ? 'Suppression...' : 'Confirmer' }}
        </button>
        <button
          type="button"
          @click="cancelDelete"
          :disabled="isDeleting"
          class="btn-cancel-delete"
        >
          Annuler
        </button>
      </div>
    </div>

    <!-- Message d'erreur -->
    <span v-if="error" class="error-message">{{ error }}</span>

    <!-- Modale de réassignation -->
    <ReassignmentModal
      :isOpen="showReassignmentModal"
      :resourceType="resourceType"
      :itemToDelete="reassignmentData.itemToDelete"
      :dependentCourses="reassignmentData.dependentCourses"
      @success="handleReassignmentSuccess"
      @close="handleReassignmentClose"
    />
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed, onMounted, onUnmounted } from 'vue'
import { useFiltersStore } from '@/stores/filters'
import { useAuthStore } from '@/stores/auth'
import { createSession, updateSession as updateSessionService, deleteSession as deleteSessionService } from '@/_services/sessions.service'
import { createNiveauScolaire, updateNiveauScolaire as updateNiveauScolaireService, deleteNiveauScolaire as deleteNiveauScolaireService } from '@/_services/niveauxScolaires.service'
import { createThematique, updateThematique as updateThematiqueService, deleteThematique as deleteThematiqueService } from '@/_services/thematiques.service'
import ReassignmentModal from '@/components/ReassignmentModal.vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Sélectionner...'
  },
  labelSingular: {
    type: String,
    required: true // e.g., "la session", "le niveau", "la thématique"
  },
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const filtersStore = useFiltersStore()
const authStore = useAuthStore()

// Refs
const smartSelectRef = ref(null)
const addInput = ref(null)
const editInput = ref(null)

// État - Dropdown
const isOpen = ref(false)
const selectedValue = ref(props.modelValue)

// État - Ajout
const isAdding = ref(false)
const newItemName = ref('')
const isCreating = ref(false)

// État - Édition
const isEditing = ref(false)
const editingItemId = ref(null)
const editingItemName = ref('')
const isUpdating = ref(false)

// État - Suppression
const isDeleting = ref(false)
const deletingItemId = ref(null)
const deletingItemName = ref('')
const showDeleteConfirm = ref(false)

// État - Modale de réassignation
const showReassignmentModal = ref(false)
const reassignmentData = ref({
  itemToDelete: null,
  dependentCourses: []
})

// État - Erreur
const error = ref('')

// Computed : Label de l'option sélectionnée
const selectedLabel = computed(() => {
  if (!selectedValue.value) return ''
  const option = props.options.find(o => o._id === selectedValue.value)
  return option?.name || ''
})

// Watch external modelValue changes
watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue
})

/**
 * Toggle dropdown
 */
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

/**
 * Sélectionner une option
 */
const selectOption = (id) => {
  selectedValue.value = id
  emit('update:modelValue', id)
  isOpen.value = false
}

/**
 * Démarrer l'ajout
 */
const startAdd = () => {
  isAdding.value = true
  isOpen.value = false
  nextTick(() => {
    addInput.value?.focus()
  })
}

/**
 * Handle adding new item
 */
const handleAdd = async () => {
  if (!newItemName.value.trim()) return

  isCreating.value = true
  error.value = ''

  try {
    let createdItem = null

    // Call appropriate service based on field name
    switch (props.name) {
      case 'session':
        if(!(/^(19|20)\d{2}-(19|20)\d{2}$/).test(newItemName.value)) {
          error.value = "Format du nom d'une session: yyyy-yyyy (ex 2025-2026)"
          return
        }
        createdItem = await createSession({ name: newItemName.value.trim() })
        filtersStore.addSession(createdItem)
        break
      case 'niveau-scolaire':
        createdItem = await createNiveauScolaire({ name: newItemName.value.trim() })
        filtersStore.addNiveauScolaire(createdItem)
        break
      case 'theme':
        createdItem = await createThematique({ name: newItemName.value.trim() })
        filtersStore.addThematique(createdItem)
        break
      default:
        throw new Error(`Unknown field type: ${props.name}`)
    }

    // Select the newly created item
    selectedValue.value = createdItem._id
    emit('update:modelValue', createdItem._id)

    // Reset add form
    cancelAdd()
  } catch (err) {
    if (err.response?.status === 409) {
      error.value = 'Ce nom existe déjà'
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Erreur lors de la création'
    }
    console.error('Erreur création:', err)
  } finally {
    isCreating.value = false
  }
}

/**
 * Cancel adding new item
 */
const cancelAdd = () => {
  isAdding.value = false
  newItemName.value = ''
  error.value = ''
}

/**
 * Démarrer l'édition
 */
const startEdit = (option) => {
  isEditing.value = true
  editingItemId.value = option._id
  editingItemName.value = option.name
  isOpen.value = false
  nextTick(() => {
    editInput.value?.focus()
  })
}

/**
 * Handle updating item
 */
const handleUpdate = async () => {
  if (!editingItemName.value.trim()) return

  isUpdating.value = true
  error.value = ''

  try {
    let updatedItem = null

    switch (props.name) {
      case 'session':
        updatedItem = await updateSessionService(editingItemId.value, {
          name: editingItemName.value.trim()
        })
        filtersStore.updateSession(editingItemId.value, updatedItem)
        break
      case 'niveau-scolaire':
        updatedItem = await updateNiveauScolaireService(editingItemId.value, {
          name: editingItemName.value.trim()
        })
        filtersStore.updateNiveauScolaire(editingItemId.value, updatedItem)
        break
      case 'theme':
        updatedItem = await updateThematiqueService(editingItemId.value, {
          name: editingItemName.value.trim()
        })
        filtersStore.updateThematique(editingItemId.value, updatedItem)
        break
      default:
        throw new Error(`Unknown field type: ${props.name}`)
    }

    // Garder la sélection sur l'item modifié
    selectedValue.value = editingItemId.value

    cancelEdit()
  } catch (err) {
    if (err.response?.status === 409) {
      error.value = 'Ce nom existe déjà'
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Erreur lors de la mise à jour'
    }
    console.error('Erreur mise à jour:', err)
  } finally {
    isUpdating.value = false
  }
}

/**
 * Cancel editing
 */
const cancelEdit = () => {
  isEditing.value = false
  editingItemId.value = null
  editingItemName.value = ''
  error.value = ''
}

/**
 * Confirmer la suppression
 */
const confirmDelete = (option) => {
  deletingItemId.value = option._id
  deletingItemName.value = option.name
  showDeleteConfirm.value = true
  isOpen.value = false
}

/**
 * Handle deleting item
 */
const handleDelete = async () => {
  isDeleting.value = true
  error.value = ''

  try {
    // Appeler le service de suppression
    switch (props.name) {
      case 'session':
        await deleteSessionService(deletingItemId.value)
        filtersStore.deleteSession(deletingItemId.value)
        break
      case 'niveau-scolaire':
        await deleteNiveauScolaireService(deletingItemId.value)
        filtersStore.deleteNiveauScolaire(deletingItemId.value)
        break
      case 'theme':
        await deleteThematiqueService(deletingItemId.value)
        filtersStore.deleteThematique(deletingItemId.value)
        break
      default:
        throw new Error(`Unknown field type: ${props.name}`)
    }

    // Si l'élément supprimé était sélectionné, réinitialiser
    if (selectedValue.value === deletingItemId.value) {
      selectedValue.value = ''
      emit('update:modelValue', '')
    }

    cancelDelete()
  } catch (err) {
    console.log('❌ Erreur attrapée dans handleDelete:', err)
    console.log('📊 err.status:', err.status)
    console.log('📊 err.data:', err.data)

    // Si erreur 409 (conflit = dépendances), ouvrir la modale de réassignation
    // Note: Axios peut retourner soit err.response.status soit err.status selon le contexte
    const status = err.response?.status || err.status
    const errorData = err.response?.data || err.data

    if (status === 409) {
      console.log('🔄 Erreur 409 détectée, ouverture de la modale de réassignation')
      const dependenciesData = errorData.data

      reassignmentData.value = {
        itemToDelete: {
          _id: deletingItemId.value,
          name: deletingItemName.value
        },
        dependentCourses: dependenciesData.dependentCourses
      }

      console.log('📦 reassignmentData:', reassignmentData.value)
      console.log('🚀 Ouverture de la modale, showReassignmentModal:', showReassignmentModal.value, '→ true')

      showReassignmentModal.value = true
      showDeleteConfirm.value = false
      isDeleting.value = false
      return
    }

    // Autres erreurs
    const errorMessage = errorData?.message || err.message
    if (errorMessage) {
      error.value = errorMessage
    } else {
      error.value = 'Erreur lors de la suppression'
    }
    console.error('Erreur suppression:', err)
  } finally {
    isDeleting.value = false
  }
}

/**
 * Cancel deleting
 */
const cancelDelete = () => {
  showDeleteConfirm.value = false
  deletingItemId.value = null
  deletingItemName.value = ''
  isDeleting.value = false
}

/**
 * Handle reassignment success
 */
const handleReassignmentSuccess = () => {
  showReassignmentModal.value = false
  reassignmentData.value = {
    itemToDelete: null,
    dependentCourses: []
  }

  // Si l'élément supprimé était sélectionné, réinitialiser
  if (selectedValue.value === deletingItemId.value) {
    selectedValue.value = ''
    emit('update:modelValue', '')
  }

  cancelDelete()
}

/**
 * Handle reassignment close
 */
const handleReassignmentClose = () => {
  showReassignmentModal.value = false
  reassignmentData.value = {
    itemToDelete: null,
    dependentCourses: []
  }
  cancelDelete()
}

/**
 * Computed: Get resourceType for reassignment API
 */
const resourceType = computed(() => {
  switch (props.name) {
    case 'session':
      return 'session'
    case 'niveau-scolaire':
      return 'niveauScolaire'
    case 'theme':
      return 'thematique'
    default:
      return props.name
  }
})

/**
 * Fermer le dropdown si clic à l'extérieur
 */
const handleClickOutside = (event) => {
  if (smartSelectRef.value && !smartSelectRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.smart-select {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

/* Liste déroulante personnalisée */
.custom-select {
  position: relative;
}

.select-trigger {
  width: 100%;
  height: 48px;
  padding: 0 45px 0 16px;
  border-radius: 8px;
  font-family: var(--font-family-title3_4_text);
  font-size: var(--font-size-text-primary-desktop);
  background-color: white;
  color: var(--color-secondary);
  border: 2px solid #e0e0e0;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s, box-shadow 0.2s;
  position: relative;
}

.select-trigger:hover {
  border-color: var(--color-icons);
}

.select-trigger:focus {
  outline: none;
  border-color: var(--color-icons);
  box-shadow: 0 0 0 3px rgba(38, 170, 226, 0.1);
}

.select-trigger:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.dropdown-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-icons);
  font-size: 24px;
  pointer-events: none;
}

.options-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 2px solid var(--color-icons);
  border-radius: 8px;
  margin-top: 4px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.option-item:last-child {
  border-bottom: none;
}

.option-item:hover {
  background-color: #f8f9fa;
}

.option-item.add-new {
  color: var(--color-icons);
  font-weight: 600;
}

.option-name {
  flex: 1;
}

.option-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.option-item:hover .option-actions {
  opacity: 1;
}

.btn-edit-inline,
.btn-delete-inline {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.btn-edit-inline {
  background-color: var(--color-secondary);
  color: white;
}

.btn-edit-inline:hover {
  background-color: var(--color-icons);
  transform: scale(1.1);
}

.btn-delete-inline {
  background-color: #e74c3c;
  color: white;
}

.btn-delete-inline:hover {
  background-color: #c0392b;
  transform: scale(1.1);
}

/* Formulaires d'ajout et d'édition */
.add-form,
.edit-form {
  display: flex;
  gap: 8px;
  align-items: center;
}

.add-input,
.edit-input {
  flex: 1;
  height: 48px;
  padding: 0 16px;
  border-radius: 8px;
  font-family: var(--font-family-title3_4_text);
  font-size: var(--font-size-text-primary-desktop);
  transition: box-shadow 0.2s;
}

.add-input {
  border: 2px solid var(--color-icons);
}

.edit-input {
  border: 2px solid var(--color-secondary);
}

.add-input:focus,
.edit-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(38, 170, 226, 0.1);
}

.btn-confirm,
.btn-cancel {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;
}

.btn-confirm {
  background-color: var(--color-secondary);
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background-color: var(--color-icons);
  transform: scale(1.05);
}

.btn-confirm:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #e74c3c;
  color: white;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #c0392b;
  transform: scale(1.05);
}

.btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Confirmation de suppression */
.delete-confirm {
  padding: 16px;
  background-color: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
}

.confirm-message {
  margin: 0 0 12px 0;
  color: #856404;
  font-family: var(--font-family-title3_4_text);
  font-size: 14px;
}

.confirm-actions {
  display: flex;
  gap: 8px;
}

.btn-confirm-delete,
.btn-cancel-delete {
  flex: 1;
  height: 40px;
  border: none;
  border-radius: 8px;
  font-family: var(--font-family-title3_4_text);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-confirm-delete:hover:not(:disabled) {
  background-color: #c0392b;
}

.btn-confirm-delete:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-cancel-delete {
  background-color: #6c757d;
  color: white;
}

.btn-cancel-delete:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn-cancel-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Message d'erreur */
.error-message {
  font-size: 14px;
  color: #e74c3c;
  font-family: var(--font-family-title3_4_text);
}

/* Responsive */
@media (max-width: 768px) {
  .select-trigger,
  .add-input,
  .edit-input {
    font-size: var(--font-size-text-primary-mobile);
  }
}
</style>
