import { ref } from "vue"
import { defineStore } from 'pinia'

export const useFiltersStore = defineStore("filters", () => {
  const sessionFilter = ref(null)
  const levelFilter = ref(null)
  const themeFilter = ref(null)

  return {
    sessionFilter,
    levelFilter,
    themeFilter
  }
})