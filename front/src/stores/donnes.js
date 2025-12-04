import { ref, computed } from "vue"
import { defineStore } from 'pinia'
import { getCours } from "@/_services/donnees.service"
import { getSessions } from "@/_services/sessions.service"
import { getNiveauxScolaires } from "@/_services/niveauxScolaires.service"
import { getThematiques } from "@/_services/thematiques.service"
import { useFiltersStore } from './filters'

export const useDonnesStore = defineStore('donnees', () => {
  // États pour les cours
  const rawCours = ref([]) // Données brutes de l'API (filtrées par session uniquement)
  const isLoading = ref(false)
  const isLoaded = ref(false)

  // États pour les collections de référence
  const sessions = ref([])
  const sessionsLoaded = ref(false)
  const sessionsLoading = ref(false)

  const niveauxScolaires = ref([])
  const niveauxLoaded = ref(false)
  const niveauxLoading = ref(false)

  const thematiques = ref([])
  const thematiquesLoaded = ref(false)
  const thematiquesLoading = ref(false)

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
   * Computed : Détecte automatiquement la session courante
   * Retourne l'ObjectId de la session courante ou de la dernière session
   */
  const defaultSessionId = computed(() => {
    if (sessions.value.length === 0) return null

    const now = new Date().getTime()

    // Chercher la session courante (celle qui contient la date actuelle)
    for (let session of sessions.value) {
      const sessionsArray = session.name.split("-")
      const startSession = new Date(sessionsArray[0], 6).getTime() // Juillet (mois 6)
      const endSession = new Date(sessionsArray[1], 5, 30).getTime() // Juin (mois 5), jour 30

      if (now >= startSession && now <= endSession) {
        return session._id
      }
    }

    // Si aucune session courante, retourner la dernière (tri décroissant par nom)
    const sortedSessions = [...sessions.value].sort((a, b) => b.name.localeCompare(a.name))
    return sortedSessions[0]?._id || null
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
   * Charge toutes les sessions
   */
  async function loadSessions() {
    if (sessionsLoaded.value) return

    sessionsLoading.value = true
    try {
      const sessionsRes = await getSessions()
      sessions.value = sessionsRes
      sessionsLoaded.value = true
    } catch (error) {
      console.error('Erreur chargement sessions:', error)
    } finally {
      sessionsLoading.value = false
    }
  }

  /**
   * Charge tous les niveaux scolaires
   */
  async function loadNiveauxScolaires() {
    if (niveauxLoaded.value) return

    niveauxLoading.value = true
    try {
      const niveauxRes = await getNiveauxScolaires()
      niveauxScolaires.value = niveauxRes
      niveauxLoaded.value = true
    } catch (error) {
      console.error('Erreur chargement niveaux scolaires:', error)
    } finally {
      niveauxLoading.value = false
    }
  }

  /**
   * Charge toutes les thématiques
   */
  async function loadThematiques() {
    if (thematiquesLoaded.value) return

    thematiquesLoading.value = true
    try {
      const thematiquesRes = await getThematiques()
      thematiques.value = thematiquesRes
      thematiquesLoaded.value = true
    } catch (error) {
      console.error('Erreur chargement thématiques:', error)
    } finally {
      thematiquesLoading.value = false
    }
  }

  /**
   * Charge toutes les données de référence en parallèle
   */
  async function loadAllReferenceData() {
    await Promise.all([
      loadSessions(),
      loadNiveauxScolaires(),
      loadThematiques()
    ])
  }

  /**
   * Charge les données initiales (référence + cours)
   */
  async function loadDatas() {
    if (isLoaded.value) return

    await loadAllReferenceData()
    await loadCours()
  }

  /**
   * Ajoute une nouvelle session au store
   */
  function addSession(session) {
    sessions.value.push(session)
  }

  /**
   * Ajoute un nouveau niveau scolaire au store
   */
  function addNiveauScolaire(niveau) {
    niveauxScolaires.value.push(niveau)
  }

  /**
   * Ajoute une nouvelle thématique au store
   */
  function addThematique(thematique) {
    thematiques.value.push(thematique)
  }

  /**
   * Ajoute un nouveau cours au store
   */
  function addCours(cours) {
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

  return {
    // États cours
    rawCours,
    cours: filteredCours, // Exporter les données filtrées comme 'cours'
    isLoading,
    isLoaded,

    // États collections de référence
    sessions,
    sessionsLoaded,
    sessionsLoading,
    niveauxScolaires,
    niveauxLoaded,
    niveauxLoading,
    thematiques,
    thematiquesLoaded,
    thematiquesLoading,

    // Computed
    defaultSessionId,

    // Actions
    loadDatas,
    loadCours,
    loadSessions,
    loadNiveauxScolaires,
    loadThematiques,
    loadAllReferenceData,
    addSession,
    addNiveauScolaire,
    addThematique,
    addCours,
    updateCoursInStore
  }
})
