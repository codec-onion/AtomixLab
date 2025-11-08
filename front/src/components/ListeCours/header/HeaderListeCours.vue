<template>
  <header>
    <div class="line"></div>
    <Select name="session" placeHolder="Session" :options="optionsSession" />
    <Select name="niveau-scolaire" placeHolder="Niveau scolaire" :options="optionsNiveauScolaire" />
    <Select name="theme" placeHolder="Thème" :options="optionsTheme" />
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDonnesStore } from '@/stores/donnes'
import Select from './Select.vue'

const donneesStore = useDonnesStore()
const { cours } = storeToRefs(donneesStore)
const optionsSession = computed(() => {
  const sessions = new Set([])
  cours.value.forEach((el) => sessions.add(el.session))
  return [...sessions]
})
const optionsNiveauScolaire = computed(() => {
  const niveauxScolaire = new Set([])
  cours.value.forEach((el) => niveauxScolaire.add(el.niveauScolaire))
  return [...niveauxScolaire]
})
const optionsTheme = computed(() => {
  const thematiques = new Set([])
  cours.value.forEach((el) => thematiques.add(el.thematique))
  return [...thematiques]
})
</script>

<style scoped>
header {
  margin-bottom: 50px;
  position: relative;
  padding: 20px;
  background: linear-gradient(var(--color-primary), var(--color-tertiary));
}
.line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-icons);
}
</style>
