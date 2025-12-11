import { ref, computed } from "vue"
import { defineStore } from 'pinia'
import { getCours } from "@/_services/donnees.service"
import { useFiltersStore } from './filters'

export const useDonnesStore = defineStore('donnees', () => {
  // États pour les cours
  const rawCours = ref([]) // Données brutes de l'API (filtrées par session uniquement)
  const isLoading = ref(false)
  const isLoaded = ref(false)

  /**
   * Computed : Filtre les cours côté client par niveau et thème
   * Retourne les cours filtrés selon les filtres actifs
   */
  const filteredCours = computed(() => {
    const filtersStore = useFiltersStore()

    // Retour anticipé si aucun filtre client appliqué
    if (!filtersStore.levelFilter && !filtersStore.themeFilter) {
      return rawCours.value
    }

    let filtered = rawCours.value

    // Filtrage par niveau scolaire
    if (filtersStore.levelFilter) {
      filtered = filtered.filter(course => {
        const courseLevel = course.niveauScolaire?._id || course.niveauScolaire
        return courseLevel === filtersStore.levelFilter
      })
    }

    // Filtrage par thématique
    if (filtersStore.themeFilter) {
      filtered = filtered.filter(course => {
        const courseTheme = course.thematique?._id || course.thematique
        return courseTheme === filtersStore.themeFilter
      })
    }

    return filtered
  })

  /**
   * Charge tous les cours (filtrés par session uniquement)
   * @param {string|null} sessionId - ID de la session ou null pour tous les cours
   */
  async function loadCours(sessionId = null) {
    isLoading.value = true
    try {
      const filters = {}
      if (sessionId) filters.session = sessionId

      const coursRes = await getCours(filters)
      rawCours.value = coursRes // Stocker les données brutes
      isLoaded.value = true
    } catch (error) {
      console.error('Erreur chargement cours:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Ajoute un nouveau cours au store
   */
  function addCours(cours) {
    const filtersStore = useFiltersStore()
    if (cours.session !== filtersStore.sessionFilter) return
    rawCours.value.unshift(cours) // Ajouter en début de liste
  }

  /**
   * Met à jour un cours existant dans le store
   */
  function updateCoursInStore(id, updatedCours) {
    const index = rawCours.value.findIndex(c => c._id === id)
    if (index !== -1) {
      rawCours.value[index] = updatedCours
    }
  }

  /**
   * Supprime un cours du store
   */
  function deleteCourseInStore (id) {
    const index = rawCours.value.findIndex(c => c._id === id)
    rawCours.value.splice(index, 1)
  }

  return {
    // États cours
    rawCours,
    cours: filteredCours, // Exporter les données filtrées comme 'cours'
    isLoading,
    isLoaded,

    // Actions
    loadCours,
    addCours,
    updateCoursInStore,
    deleteCourseInStore
  }
})
