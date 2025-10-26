<template>
  <footer>
    <p>© Copyright {{ currentYear }}</p>
    <p>Toute reproduction partielle ou totale est interdite.</p>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
footer {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--color-secondary);
  color: var(--color-tertiary);
  text-align: center;
  padding: 10px;
  font-family: var(--font-family-title3_text);
  font-size: var(--font-size-text-secondary-desktop);
}
</style>
