<template>
  <header>
    <div class="line"></div>
    <Select name="session" placeHolder="Session" :defaultValue="defaultValueSession" :options="optionsSession" />
    <Select name="niveau-scolaire" placeHolder="Niveau scolaire" :options="optionsNiveauScolaire" />
    <Select name="theme" placeHolder="Thème" :options="optionsTheme" />
  </header>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useFiltersStore } from '@/stores/filters'
import Select from './Select.vue'

const defaultValueSession = ref(null)

const filtersStore = useFiltersStore()
const { sessions, niveauxScolaires, thematiques, defaultSessionId } = storeToRefs(filtersStore)

// Options triées pour les selects
const optionsSession = computed(() => {
  return [...sessions.value].sort((a, b) => b.name.localeCompare(a.name))
})

const optionsNiveauScolaire = computed(() => {
  return [...niveauxScolaires.value].sort((a, b) => a.name.localeCompare(b.name))
})

const optionsTheme = computed(() => {
  return [...thematiques.value].sort((a, b) => a.name.localeCompare(b.name))
})

// Utiliser le defaultSessionId du store (calculé automatiquement)
watch(defaultSessionId, (newDefaultId) => {
  if (newDefaultId) {
    defaultValueSession.value = newDefaultId
  }
}, { immediate: true })
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
