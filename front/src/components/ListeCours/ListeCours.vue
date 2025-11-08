<template>
  <section class="margin_section">
    <HeaderListeCours />
    <div class="cours">
      <Cours v-for="c in cours" :key="c._id" :infosCours="getInfosCours(c)"/>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDonnesStore } from '@/stores/donnes'
import HeaderListeCours from './header/HeaderListeCours.vue'
import Cours from './Cours.vue'

const donneesStore = useDonnesStore()
const { cours } = storeToRefs(donneesStore)

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
