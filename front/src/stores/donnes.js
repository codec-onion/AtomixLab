import { ref, computed } from "vue"
import { defineStore } from 'pinia'
import { getCours } from "@/_services/donnees.service"
import { getSessions } from "@/_services/sessions.service"
import { getNiveauxScolaires } from "@/_services/niveauxScolaires.service"
import { getThematiques } from "@/_services/thematiques.service"

export const useDonnesStore = defineStore('donnees', () => {
  // États pour les cours
  const cours = ref([])
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
   * Charge tous les cours (avec filtres optionnels)
   */
  async function loadCours(filters = {}) {
    isLoading.value = true
    try {
      const coursRes = await getCours(filters)
      cours.value = coursRes
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

  return {
    // États cours
    cours,
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
    loadAllReferenceData
  }
})
