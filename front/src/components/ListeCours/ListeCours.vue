<template>
  <section class="margin_section">
    <Header />
  </section>
</template>

<script setup>
import Header from './Header.vue';
</script>

<style scoped>
section {
  margin-bottom: 50px;
  position: relative;
  padding: 20px;
  background: linear-gradient(var(--color-primary), var(--color-tertiary));
}
</style>
