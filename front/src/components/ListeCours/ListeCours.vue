<template>
  <section class="margin_section">
    <HeaderListeCours />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import HeaderListeCours from './header/HeaderListeCours.vue'
import { getSessions } from '@/_services/donnees.service'
import { useDonnesStore } from '@/stores/donnes'

const donneesStore = useDonnesStore()

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
