<template>
  <section class="margin_section">
    <HeaderListeCours />
    <Cours v-for="c in cours" :key="c._id" :session="getSessionDuCours(c)"/>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDonnesStore } from '@/stores/donnes'
import HeaderListeCours from './header/HeaderListeCours.vue'
import Cours from './Cours.vue'

const donneesStore = useDonnesStore()
const { sessions, cours } = storeToRefs(donneesStore)

const getSessionDuCours = (cours) => {
  
}

onMounted(async () => {
  await donneesStore.loadDatas()
})
</script>

<style scoped>
section {
  margin-bottom: 50px;
  position: relative;
  padding: 20px;
  background: linear-gradient(var(--color-primary), var(--color-tertiary));
}
</style>
