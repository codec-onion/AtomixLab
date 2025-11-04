import { ref, computed } from "vue"
import { defineStore } from 'pinia'
import { getSessions, getCours } from "@/_services/donnees.service"

export const useDonnesStore = defineStore('donnees', () => {
  const sessions = ref([])
  const cours = ref([])
  const isLoading = ref(false)
  const isLoaded = ref(false)

  async function loadDatas() {
    if (isLoaded.value) return
    
    isLoading.value = true
    try {
      const sessionsRes = await getSessions()
      const coursRes = await getCours()
      
      sessions.value = sessionsRes
      cours.value = coursRes
      isLoaded.value = true
    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      isLoading.value = false
    }
  }

  return { 
    sessions, 
    cours, 
    isLoading, 
    isLoaded,
    loadDatas 
  }
})
