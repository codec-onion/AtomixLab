<template>
  <div class="select">
    <select :name="name" ref="selectRef" @focus="onFocus" @change="onChange">
      <slot />
    </select>
    <font-awesome-icon
      :class="['font_awesome', { rotated: isOpen }]"
      icon="fa-solid fa-circle-chevron-down"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const { name } = defineProps(['name'])

const isOpen = ref(false)
const selectRef = ref(null)

const onFocus = () => {
  isOpen.value = true
}

const onChange = () => {
  isOpen.value = false
}
</script>

<style scoped>
.select {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}
.select:not(.select:nth-child(5)) {
  margin-right: 20px;
}
select {
  width: 250px;
  height: 40px;
  border-radius: 20px;
  text-align: center;
  font-family: var(--font-family-title3_4_text);
  font-size: var(--font-size-text-primary-desktop);
  color: var(--color-secondary);
  appearance: none;
  border: none;
}
.font_awesome {
  color: var(--color-icons);
  font-size: 40px;
  position: absolute;
  right: -5px;
  pointer-events: none;
  transition: transform 0.2s ease-in-out;
}
.rotated {
  transform: rotate(180deg);
}
</style>
