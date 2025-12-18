<template>
  <section class="margin_section">
    <HeaderListeCours />
    <div class="cours">
      <CoursPlus
        v-if="isAdmin"
        @openCreateModal="openCreateModal"
      />
      <Cours
        v-for="c in cours"
        :key="c._id"
        :infosCours="getInfosCours(c)"
        @openEditModal="openEditModal"
        @openDeleteModal="openDeleteModal"
      />
    </div>

    <!-- Modal du formulaire -->
    <Modal
      :isOpen="isModalOpen"
      :title="modalTitle"
      @close="closeModal"
      :closeOnBackdrop="false"
    >
      <CreateOrUpdateCourseForm
        :courseId="editCourseId"
        @success="handleFormSuccess"
        @cancel="closeModal"
      />
    </Modal>

    <!-- Modal de confirmation de suppression -->
    <Modal
      :isOpen="isModalDeleteOpen"
      title="Supprimer le cours"
      @close="closeDeleteModal"
      :closeOnBackdrop="true"
    >
      <DeleteCours
        v-if="courseToDelete"
        :courseInfo="courseToDelete"
        @cancel="closeDeleteModal"
        @confirm="handleDeleteConfirm"
      />
    </Modal>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDonnesStore } from '@/stores/donnes'
import { useFiltersStore } from '@/stores/filters'
import { useAuthStore } from '@/stores/auth'
import { deleteCours } from '@/_services/donnees.service'
import HeaderListeCours from './header/HeaderListeCours.vue'
import Cours from './Cours.vue'
import CoursPlus from './CoursPlus.vue'
import Modal from '@/components/Modal.vue'
import CreateOrUpdateCourseForm from '@/components/CreateOrUpdateCourseForm.vue'
import DeleteCours from '@/components/DeleteCours.vue'

const authStore = useAuthStore()
const { isAdmin } = storeToRefs(authStore)

const donneesStore = useDonnesStore()
const { cours } = storeToRefs(donneesStore)

const filtersStore = useFiltersStore()
const { sessionFilter } = storeToRefs(filtersStore) // UNIQUEMENT surveiller session

// Modal state for create/edit
const isModalOpen = ref(false)
const editCourseId = ref(null)

const modalTitle = computed(() => {
  return editCourseId.value ? 'Modifier le cours' : 'Créer un nouveau cours'
})

// Modal state for delete
const isModalDeleteOpen = ref(false)
const courseToDelete = ref(null)

/**
 * Open modal for creating new course
 */
const openCreateModal = () => {
  editCourseId.value = null
  isModalOpen.value = true
}

/**
 * Open modal for editing existing course
 */
const openEditModal = (courseId) => {
  editCourseId.value = courseId
  isModalOpen.value = true
}

/**
 * Close modal
 */
const closeModal = () => {
  isModalOpen.value = false
  editCourseId.value = null
}

/**
 * Handle form success (create or update)
 */
const handleFormSuccess = () => {
  closeModal()
}

/**
 * Open delete confirmation modal
 */
const openDeleteModal = (courseInfo) => {
  courseToDelete.value = courseInfo
  isModalDeleteOpen.value = true
}

/**
 * Close delete confirmation modal
 */
const closeDeleteModal = () => {
  isModalDeleteOpen.value = false
  courseToDelete.value = null
}

/**
 * Handle course deletion after confirmation
 */
const handleDeleteConfirm = async () => {
  if (!courseToDelete.value) return

  try {
    // Supprimer côté serveur
    await deleteCours(courseToDelete.value.id)
    // Mettre à jour le store local
    donneesStore.deleteCourseInStore(courseToDelete.value.id)
    closeDeleteModal()
  } catch (error) {
    console.error('Erreur lors de la suppression du cours:', error)
    // TODO: afficher un message d'erreur à l'utilisateur
  }
}

/**
 * Extrait les informations d'un cours pour l'affichage
 * Gère le format populate (session: {_id, name})
 */
const getInfosCours = (cours) => {
  const infosCours = {
    id: cours._id, // IMPORTANT: Include ID for edit functionality
    session: cours.session?.name || cours.session,
    niveauScolaire: cours.niveauScolaire?.name || cours.niveauScolaire,
    thematique: cours.thematique?.name || cours.thematique,
    type: cours.type,
    title: cours.title,
    url: cours.urlDownload
  }
  return infosCours
}

/**
 * Recharge les cours pour la session actuelle
 * Niveau et thème sont filtrés côté client via computed property
 */
const loadCoursForSession = async () => {
  await donneesStore.loadCours(sessionFilter.value)
}

// Watcher sur sessionFilter uniquement pour recharger depuis le serveur
// Niveau et thème sont gérés par la propriété calculée dans le store
// Ce watcher se déclenche automatiquement quand la session par défaut est appliquée
watch(sessionFilter, () => {
  loadCoursForSession()
})

onMounted(async () => {
  // Charger uniquement les collections de référence
  // Le reste se fait automatiquement via la réactivité :
  // 1. defaultSessionId (computed) calcule la session courante
  // 2. HeaderListeCours (watch) applique le filtre
  // 3. Le watcher ci-dessus charge les cours filtrés
  await filtersStore.loadAllReferenceData()
})
</script>

<style scoped>
/* .cours {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
} */
.cours {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
/* Éléments fantômes pour maintenir l'alignement sur les lignes incomplètes */
/* .cours::after {
  content: "";
  width: 350px;
} */
.cours > * {
  /* flex-grow:2; */
}
</style>
