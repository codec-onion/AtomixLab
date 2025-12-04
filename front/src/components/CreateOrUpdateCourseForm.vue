<template>
  <div class="course-form">
    <!-- Loading state for edit mode -->
    <div v-if="isLoadingCourse" class="loading-state">
      <font-awesome-icon icon="fa-solid fa-spinner" spin size="2x" />
      <p>Chargement du cours...</p>
    </div>

    <!-- Error loading course -->
    <div v-else-if="loadError" class="error-banner">
      <font-awesome-icon icon="fa-solid fa-circle-exclamation" />
      <span>{{ loadError }}</span>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="form">
      <!-- Title field -->
      <div class="form-group">
        <label for="title">Titre du cours <span class="required">*</span></label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          placeholder="Ex: Les réactions acido-basiques"
          :disabled="isSubmitting"
          @blur="validateTitle"
          maxlength="200"
        />
        <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
      </div>

      <!-- Type field (radio buttons) -->
      <div class="form-group">
        <label>Type de cours <span class="required">*</span></label>
        <div class="radio-group">
          <label class="radio-label">
            <input
              type="radio"
              v-model="formData.type"
              value="Chimie"
              :disabled="isSubmitting"
            />
            <font-awesome-icon icon="fa-solid fa-flask-vial" class="type-icon" />
            <span>Chimie</span>
          </label>
          <label class="radio-label">
            <input
              type="radio"
              v-model="formData.type"
              value="Physique"
              :disabled="isSubmitting"
            />
            <font-awesome-icon icon="fa-solid fa-explosion" class="type-icon" />
            <span>Physique</span>
          </label>
          <label class="radio-label">
            <input
              type="radio"
              v-model="formData.type"
              value="Rappel de connaissance"
              :disabled="isSubmitting"
            />
            <font-awesome-icon icon="fa-solid fa-book" class="type-icon" />
            <span>Rappel</span>
          </label>
        </div>
        <span v-if="errors.type" class="error-message">{{ errors.type }}</span>
      </div>

      <!-- Session field (smart dropdown) -->
      <div class="form-group">
        <label for="session">Session <span class="required">*</span></label>
        <SmartSelect
          name="session"
          placeholder="Sélectionner une session"
          label-singular="la session"
          :options="donneesStore.sessions"
          v-model="formData.session"
          :disabled="isSubmitting"
        />
        <span v-if="errors.session" class="error-message">{{ errors.session }}</span>
      </div>

      <!-- Niveau scolaire field (smart dropdown) -->
      <div class="form-group">
        <label for="niveau-scolaire">Niveau scolaire <span class="required">*</span></label>
        <SmartSelect
          name="niveau-scolaire"
          placeholder="Sélectionner un niveau"
          label-singular="le niveau"
          :options="donneesStore.niveauxScolaires"
          v-model="formData.niveauScolaire"
          :disabled="isSubmitting"
        />
        <span v-if="errors.niveauScolaire" class="error-message">{{ errors.niveauScolaire }}</span>
      </div>

      <!-- Thématique field (smart dropdown) -->
      <div class="form-group">
        <label for="theme">Thématique <span class="required">*</span></label>
        <SmartSelect
          name="theme"
          placeholder="Sélectionner une thématique"
          label-singular="la thématique"
          :options="donneesStore.thematiques"
          v-model="formData.thematique"
          :disabled="isSubmitting"
        />
        <span v-if="errors.thematique" class="error-message">{{ errors.thematique }}</span>
      </div>

      <!-- URL Download field -->
      <div class="form-group">
        <label for="urlDownload">URL de téléchargement <span class="required">*</span></label>
        <input
          id="urlDownload"
          v-model="formData.urlDownload"
          type="url"
          placeholder="https://example.com/cours.pdf"
          :disabled="isSubmitting"
          @blur="validateUrlDownload"
        />
        <span v-if="errors.urlDownload" class="error-message">{{ errors.urlDownload }}</span>
      </div>

      <!-- Description field (optional) -->
      <div class="form-group">
        <label for="description">Description (optionnel)</label>
        <textarea
          id="description"
          v-model="formData.description"
          placeholder="Description du cours..."
          :disabled="isSubmitting"
          rows="4"
          maxlength="500"
        ></textarea>
        <span class="char-count">{{ formData.description.length }} / 500</span>
      </div>

      <!-- Global error message -->
      <div v-if="errors.global" class="error-banner">
        <font-awesome-icon icon="fa-solid fa-circle-exclamation" />
        <span>{{ errors.global }}</span>
      </div>

      <!-- Action buttons -->
      <div class="form-actions">
        <button
          type="button"
          @click="handleCancel"
          class="btn-cancel"
          :disabled="isSubmitting"
        >
          Annuler
        </button>
        <button
          type="submit"
          class="btn-submit"
          :disabled="!isFormValid || isSubmitting"
        >
          <span v-if="!isSubmitting">
            {{ isEditMode ? 'Modifier' : 'Créer' }}
          </span>
          <span v-else class="loading-spinner">
            <font-awesome-icon icon="fa-solid fa-spinner" spin />
            {{ isEditMode ? 'Modification...' : 'Création...' }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useDonnesStore } from '@/stores/donnes'
import { getCoursByID, createCours, updateCours } from '@/_services/donnees.service'
import SmartSelect from './ListeCours/header/SmartSelect.vue'

const props = defineProps({
  courseId: {
    type: String,
    default: null // null = create mode, string = edit mode
  }
})

const emit = defineEmits(['success', 'cancel'])

const donneesStore = useDonnesStore()

// Component state
const isLoadingCourse = ref(false)
const loadError = ref('')
const isSubmitting = ref(false)

// Form data
const formData = reactive({
  title: '',
  type: '',
  session: '',
  niveauScolaire: '',
  thematique: '',
  urlDownload: '',
  description: ''
})

// Validation errors
const errors = reactive({
  title: '',
  type: '',
  session: '',
  niveauScolaire: '',
  thematique: '',
  urlDownload: '',
  global: ''
})

// Computed
const isEditMode = computed(() => !!props.courseId)

const isFormValid = computed(() => {
  return (
    formData.title.trim().length > 0 &&
    formData.type.trim().length > 0 &&
    formData.session.length > 0 &&
    formData.niveauScolaire.length > 0 &&
    formData.thematique.length > 0 &&
    formData.urlDownload.trim().length > 0 &&
    isValidUrl(formData.urlDownload) &&
    !Object.values(errors).some(e => e && e !== '')
  )
})

// Validators
const validateTitle = () => {
  errors.title = ''
  if (!formData.title.trim()) {
    errors.title = 'Le titre est requis'
  } else if (formData.title.trim().length < 3) {
    errors.title = 'Le titre doit contenir au moins 3 caractères'
  }
}

const validateUrlDownload = () => {
  errors.urlDownload = ''
  if (!formData.urlDownload.trim()) {
    errors.urlDownload = 'L\'URL est requise'
  } else if (!isValidUrl(formData.urlDownload)) {
    errors.urlDownload = 'Format d\'URL invalide'
  }
}

const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Load course data in edit mode
 */
const loadCourse = async () => {
  if (!props.courseId) return

  isLoadingCourse.value = true
  loadError.value = ''

  try {
    const course = await getCoursByID(props.courseId)

    // Populate form with course data
    formData.title = course.title
    formData.type = course.type
    formData.session = course.session?._id || course.session
    formData.niveauScolaire = course.niveauScolaire?._id || course.niveauScolaire
    formData.thematique = course.thematique?._id || course.thematique
    formData.urlDownload = course.urlDownload || ''
    formData.description = course.description || ''
  } catch (error) {
    console.error('Erreur chargement cours:', error)
    if (error.response?.status === 404) {
      loadError.value = 'Cours introuvable'
    } else {
      loadError.value = 'Erreur lors du chargement du cours'
    }
  } finally {
    isLoadingCourse.value = false
  }
}

/**
 * Submit form (create or update)
 */
const handleSubmit = async () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => errors[key] = '')

  // Validate all fields
  validateTitle()
  validateUrlDownload()

  if (!formData.type) errors.type = 'Le type est requis'
  if (!formData.session) errors.session = 'La session est requise'
  if (!formData.niveauScolaire) errors.niveauScolaire = 'Le niveau est requis'
  if (!formData.thematique) errors.thematique = 'La thématique est requise'

  // Check if any validation errors
  if (Object.values(errors).some(e => e && e !== '')) {
    return
  }

  isSubmitting.value = true

  try {
    const courseData = {
      title: formData.title.trim(),
      type: formData.type,
      session: formData.session,
      niveauScolaire: formData.niveauScolaire,
      thematique: formData.thematique,
      urlDownload: formData.urlDownload.trim(),
      description: formData.description.trim()
    }

    if (isEditMode.value) {
      // Update existing course
      const updatedCourse = await updateCours(props.courseId, courseData)
      donneesStore.updateCoursInStore(props.courseId, updatedCourse)
    } else {
      // Create new course
      const newCourse = await createCours(courseData)
      donneesStore.addCours(newCourse)
    }

    // Emit success event
    emit('success')
  } catch (error) {
    console.error('Erreur soumission:', error)

    // Handle specific errors
    if (error.response?.status === 400) {
      errors.global = error.response.data.message || 'Données invalides'
    } else if (error.response?.status === 409) {
      errors.global = 'Un cours avec ce titre existe déjà'
    } else if (error.message === 'Network Error') {
      errors.global = 'Erreur de connexion au serveur'
    } else {
      errors.global = error.response?.data?.message || 'Une erreur est survenue'
    }
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Cancel and close form
 */
const handleCancel = () => {
  // Check if form has unsaved changes
  const hasChanges = Object.values(formData).some(v => v !== '')

  if (hasChanges && !isEditMode.value) {
    if (!confirm('Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
      return
    }
  }

  emit('cancel')
}

// Lifecycle
onMounted(async () => {
  // Ensure reference data is loaded
  await donneesStore.loadAllReferenceData()

  // Load course data if edit mode
  if (isEditMode.value) {
    await loadCourse()
  }
})
</script>

<style scoped>
.course-form {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px;
  color: var(--color-secondary);
}

.form {
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

.required {
  color: #e74c3c;
}

input[type="text"],
input[type="url"],
textarea {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: var(--font-family-title3_4_text);
  font-size: var(--font-size-text-secondary-desktop);
  transition: border-color 0.2s, box-shadow 0.2s;
}

input[type="text"]:focus,
input[type="url"]:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-icons);
  box-shadow: 0 0 0 3px rgba(38, 170, 226, 0.1);
}

input:disabled,
textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.char-count {
  font-size: 12px;
  color: #999;
  text-align: right;
}

/* Radio buttons */
.radio-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: normal;
}

.radio-label:hover {
  border-color: var(--color-icons);
  background-color: var(--color-primary);
}

.radio-label input[type="radio"] {
  cursor: pointer;
}

.radio-label:has(input[type="radio"]:checked) {
  border-color: var(--color-icons);
  background-color: var(--color-primary);
}

.radio-label:has(input[type="radio"]:checked) .type-icon {
  color: var(--color-icons);
}

.type-icon {
  font-size: 20px;
  color: var(--color-secondary);
  transition: color 0.2s;
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

/* Action buttons */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 10px;
}

.btn-cancel,
.btn-submit {
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-family: var(--font-family-title3_4_text);
  font-size: var(--font-size-text-primary-desktop);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: var(--color-secondary);
}

.btn-cancel:hover:not(:disabled) {
  background-color: #d0d0d0;
  transform: translateY(-1px);
}

.btn-submit {
  background-color: var(--color-secondary);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--color-icons);
  transform: translateY(-1px);
}

.btn-cancel:disabled,
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
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

  input,
  textarea {
    font-size: var(--font-size-text-secondary-mobile);
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>
