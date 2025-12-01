import { ref } from "vue"
import { defineStore } from 'pinia'

export const useFiltersStore = defineStore("filters", () => {
  // Filtres stockant les ObjectIds des collections
  const sessionFilter = ref(null) // ObjectId de la session sélectionnée
  const levelFilter = ref(null) // ObjectId du niveau scolaire sélectionné
  const themeFilter = ref(null) // ObjectId de la thématique sélectionnée

  return {
    sessionFilter,
    levelFilter,
    themeFilter
  }
})