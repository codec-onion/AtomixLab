<template>
  <section class="margin_section">
    <HeaderListeCours />
    <div class="cours">
      <Cours v-for="c in cours" :key="c._id" :infosCours="getInfosCours(c)"/>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDonnesStore } from '@/stores/donnes'
import { useFiltersStore } from '@/stores/filters'
import HeaderListeCours from './header/HeaderListeCours.vue'
import Cours from './Cours.vue'

const donneesStore = useDonnesStore()
const { cours } = storeToRefs(donneesStore)

const filtersStore = useFiltersStore()
const { sessionFilter, levelFilter, themeFilter } = storeToRefs(filtersStore)

/**
 * Extrait les informations d'un cours pour l'affichage
 * Gère le format populate (session: {_id, name})
 */
const getInfosCours = (cours) => {
  const infosCours = {
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
 * Recharge les cours avec les filtres actuels
 */
const loadCoursWithFilters = async () => {
  const filters = {}

  if (sessionFilter.value) filters.session = sessionFilter.value
  if (levelFilter.value) filters.niveauScolaire = levelFilter.value
  if (themeFilter.value) filters.thematique = themeFilter.value

  await donneesStore.loadCours(filters)
}

// Watcher sur les filtres pour recharger les cours depuis le serveur
// Ce watcher se déclenche automatiquement quand la session par défaut est appliquée
watch([sessionFilter, levelFilter, themeFilter], () => {
  loadCoursWithFilters()
})

onMounted(async () => {
  // Charger uniquement les collections de référence
  // Le reste se fait automatiquement via la réactivité :
  // 1. defaultSessionId (computed) calcule la session courante
  // 2. HeaderListeCours (watch) applique le filtre
  // 3. Le watcher ci-dessus charge les cours filtrés
  await donneesStore.loadAllReferenceData()
})
</script>

<style scoped>
.cours {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
