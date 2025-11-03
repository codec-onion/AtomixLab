<template>
  <section class="margin_section">
    <HeaderListeCours />
  </section>
</template>

<script setup>
import HeaderListeCours from './header/HeaderListeCours.vue';
</script>

<style scoped>
section {
  margin-bottom: 50px;
  position: relative;
  padding: 20px;
  background: linear-gradient(var(--color-primary), var(--color-tertiary));
}
</style>
