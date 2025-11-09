<template>
  <div class="select">
    <select v-if="defaultValue" :name="name" v-model="selectedValue">
      <option value="">{{ placeHolder }}</option>
      <option v-for="option in options" :value="option" :key="option">{{ option }}</option>
    </select>
    <select v-else :name="name">
      <option value="">{{ placeHolder }}</option>
      <option v-for="option in options" :value="option" :key="option">{{ option }}</option>
    </select>
    <font-awesome-icon :class="['font_awesome']" icon="fa-solid fa-circle-chevron-down" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
const { name, placeHolder, options, defaultValue } = defineProps(['name', 'placeHolder', 'options', 'defaultValue'])
const selectedValue = ref(null)
watch(() => defaultValue, (newSession) => {
  selectedValue.value = newSession;
}, { immediate: true })
</script>

<style scoped>
.select {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}
.select:not(:nth-last-child(-n + 1 of .select)) {
  margin-right: 20px;
}
select {
  height: 40px;
  padding: 0 45px 0 10px;
  border-radius: 20px;
  text-align: center;
  font-family: var(--font-family-title3_4_text);
  font-size: var(--font-size-text-primary-desktop);
  background-color: white;
  color: var(--color-secondary);
  appearance: none;
  border: 1px solid black;
}
.font_awesome {
  color: var(--color-icons);
  font-size: 40px;
  position: absolute;
  right: -5px;
  pointer-events: none;
  transition: transform 0.2s ease-in-out;
}
/* .rotated {
  transform: rotate(180deg);
} */
</style>
