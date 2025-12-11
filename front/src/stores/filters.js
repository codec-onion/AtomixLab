import { ref, computed } from "vue"
import { defineStore } from 'pinia'
import { getSessions } from "@/_services/sessions.service"
import { getNiveauxScolaires } from "@/_services/niveauxScolaires.service"
import { getThematiques } from "@/_services/thematiques.service"

export const useFiltersStore = defineStore("filters", () => {
  // Filtres stockant les ObjectIds des collections
  const sessionFilter = ref(null) // ObjectId de la session sélectionnée
  const levelFilter = ref(null) // ObjectId du niveau scolaire sélectionné
  const themeFilter = ref(null) // ObjectId de la thématique sélectionnée

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
   * Met à jour une session existante dans le store
   */
  function updateSession(id, updatedSession) {
    const index = sessions.value.findIndex(s => s._id === id)
    if (index !== -1) {
      sessions.value[index] = updatedSession
    }
  }

  /**
   * Met à jour un niveau scolaire existant dans le store
   */
  function updateNiveauScolaire(id, updatedNiveau) {
    const index = niveauxScolaires.value.findIndex(n => n._id === id)
    if (index !== -1) {
      niveauxScolaires.value[index] = updatedNiveau
    }
  }

  /**
   * Met à jour une thématique existante dans le store
   */
  function updateThematique(id, updatedThematique) {
    const index = thematiques.value.findIndex(t => t._id === id)
    if (index !== -1) {
      thematiques.value[index] = updatedThematique
    }
  }

  /**
   * Supprime une session du store
   */
  function deleteSession(id) {
    const index = sessions.value.findIndex(s => s._id === id)
    if (index !== -1) {
      sessions.value.splice(index, 1)
    }
  }

  /**
   * Supprime un niveau scolaire du store
   */
  function deleteNiveauScolaire(id) {
    const index = niveauxScolaires.value.findIndex(n => n._id === id)
    if (index !== -1) {
      niveauxScolaires.value.splice(index, 1)
    }
  }

  /**
   * Supprime une thématique du store
   */
  function deleteThematique(id) {
    const index = thematiques.value.findIndex(t => t._id === id)
    if (index !== -1) {
      thematiques.value.splice(index, 1)
    }
  }

  return {
    // Valeurs des filtres
    sessionFilter,
    levelFilter,
    themeFilter,

    // Collections de référence
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

    // Actions de chargement
    loadSessions,
    loadNiveauxScolaires,
    loadThematiques,
    loadAllReferenceData,

    // Actions CRUD
    addSession,
    addNiveauScolaire,
    addThematique,
    updateSession,
    updateNiveauScolaire,
    updateThematique,
    deleteSession,
    deleteNiveauScolaire,
    deleteThematique
  }
})
