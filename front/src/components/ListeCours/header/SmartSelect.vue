<template>
  <div class="smart-select">
    <!-- Main select dropdown -->
    <div class="select-wrapper" v-if="!isAdding">
      <select
        :name="name"
        v-model="selectedValue"
        :disabled="disabled"
      >
        <option value="">{{ placeholder }}</option>
        <option
          v-for="option in options"
          :value="option._id"
          :key="option._id"
        >
          {{ option.name }}
        </option>
        <option value="__ADD_NEW__" class="add-new-option">
          ➕ Ajouter nouveau...
        </option>
      </select>
      <font-awesome-icon
        class="dropdown-icon"
        icon="fa-solid fa-circle-chevron-down"
      />
    </div>

    <!-- Inline add form (appears when "Add new" selected) -->
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

    <!-- Error message -->
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useDonnesStore } from '@/stores/donnes'
import { createSession } from '@/_services/sessions.service'
import { createNiveauScolaire } from '@/_services/niveauxScolaires.service'
import { createThematique } from '@/_services/thematiques.service'

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

const donneesStore = useDonnesStore()

// State
const selectedValue = ref(props.modelValue)
const isAdding = ref(false)
const newItemName = ref('')
const isCreating = ref(false)
const error = ref('')
const addInput = ref(null)

// Watch external modelValue changes
watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue
})

// Watch internal selection changes
watch(selectedValue, (newValue) => {
  if (newValue === '__ADD_NEW__') {
    isAdding.value = true
    selectedValue.value = '' // Reset selection
    nextTick(() => {
      addInput.value?.focus()
    })
  } else {
    emit('update:modelValue', newValue)
  }
})

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
        createdItem = await createSession({ name: newItemName.value.trim() })
        donneesStore.addSession(createdItem)
        break
      case 'niveau-scolaire':
        createdItem = await createNiveauScolaire({ name: newItemName.value.trim() })
        donneesStore.addNiveauScolaire(createdItem)
        break
      case 'theme':
        createdItem = await createThematique({ name: newItemName.value.trim() })
        donneesStore.addThematique(createdItem)
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
</script>

<style scoped>
.smart-select {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.select-wrapper {
  position: relative;
  display: inline-block;
}

select {
  width: 100%;
  height: 48px;
  padding: 0 45px 0 16px;
  border-radius: 8px;
  font-family: var(--font-family-title3_4_text);
  font-size: var(--font-size-text-primary-desktop);
  background-color: white;
  color: var(--color-secondary);
  border: 2px solid #e0e0e0;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

select:focus {
  outline: none;
  border-color: var(--color-icons);
  box-shadow: 0 0 0 3px rgba(38, 170, 226, 0.1);
}

select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.add-new-option {
  color: var(--color-icons);
  font-weight: 600;
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

/* Add form */
.add-form {
  display: flex;
  gap: 8px;
  align-items: center;
}

.add-input {
  flex: 1;
  height: 48px;
  padding: 0 16px;
  border-radius: 8px;
  border: 2px solid var(--color-icons);
  font-family: var(--font-family-title3_4_text);
  font-size: var(--font-size-text-primary-desktop);
  transition: box-shadow 0.2s;
}

.add-input:focus {
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

.error-message {
  font-size: 14px;
  color: #e74c3c;
  font-family: var(--font-family-title3_4_text);
}

/* Responsive */
@media (max-width: 768px) {
  select,
  .add-input {
    font-size: var(--font-size-text-primary-mobile);
  }
}
</style>
