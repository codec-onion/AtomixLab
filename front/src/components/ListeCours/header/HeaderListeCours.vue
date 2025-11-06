<template>
  <header>
    <div class="line"></div>
    <Select name="session" placeHolder="Session" :options="optionsSession" />
    <Select name="niveau-scolaire" placeHolder="Niveau scolaire" :options="optionsNiveauScolaire" />
    <Select name="theme" placeHolder="Thème" :options="optionsTheme" />
    <Select name="type" placeHolder="Type" :options="['Physique', 'Chimie', 'Rappel']" />
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDonnesStore } from '@/stores/donnes'
import Select from './Select.vue'

const donneesStore = useDonnesStore()
const { sessions, cours } = storeToRefs(donneesStore)
const optionsSession = computed(() => sessions.value.map(el => el.name))
const optionsNiveauScolaire = computed(() => {
  const niveauxScolaire = new Set([])
  sessions.value.forEach(session => session.niveauxScolaire.forEach(niveauScolaire => niveauxScolaire.add(niveauScolaire.name)))
  return [...niveauxScolaire]
})
const optionsTheme = computed(() => cours.value.map(el => el.title))

</script>

<style scoped>
.line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-icons);
}
</style>
