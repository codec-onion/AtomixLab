<template>
  <header>
    <div class="line"></div>
    <Select name="session" options="optionsSession" />
    <Select name="niveau-scolaire" options="optionsNiveauScolaire" />
    <Select name="theme" options="optionsTheme" />
    <Select name="chapitre" options="optionsChapitre" />
  </header>
</template>

<script setup>
import Select from './Select.vue';

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
