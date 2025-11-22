<template>
  <section class="margin_section">
    <HeaderListeCours />
    <div class="cours">
      <Cours v-for="c in coursFiltres" :key="c._id" :infosCours="getInfosCours(c)"/>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDonnesStore } from '@/stores/donnes'
import { useFiltersStore } from '@/stores/filters'
import HeaderListeCours from './header/HeaderListeCours.vue'
import Cours from './Cours.vue'

const donneesStore = useDonnesStore()
const { cours } = storeToRefs(donneesStore)

const filtersStore = useFiltersStore()
const { sessionFilter, levelFilter, themeFilter } = storeToRefs(filtersStore)

const coursFiltres = computed(() => {
  // Si les cours ne sont pas encore chargés, retourner un tableau vide
  if (!cours.value || cours.value.length === 0) {
    return []
  }

  return cours.value.filter(c => {
    // Filtre par session
    if (sessionFilter.value && sessionFilter.value !== '' && c.session !== sessionFilter.value) {
      return false
    }

    // Filtre par niveau scolaire
    if (levelFilter.value && levelFilter.value !== '' && c.niveauScolaire !== levelFilter.value) {
      return false
    }

    // Filtre par thématique
    if (themeFilter.value && themeFilter.value !== '' && c.thematique !== themeFilter.value) {
      return false
    }

    return true
  })
})

const getInfosCours = (cours) => {
  const infosCours = {
    session: cours.session,
    niveauScolaire: cours.niveauScolaire,
    thematique: cours.thematique,
    type: cours.type,
    title: cours.title
  }
  return infosCours
}

onMounted(async () => {
  await donneesStore.loadDatas()
})
</script>

<style scoped>
.cours {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
