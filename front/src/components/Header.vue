<template>
  <header class="flexbox_usual">
    <span id="header_title">AtomixLab</span>
    <span id="header_icons">
      <!-- <a href="" @click="linkEventListener">Test</a> -->
      <font-awesome-icon icon="fa-solid fa-explosion" />
      <font-awesome-icon icon="flask-vial" />
    </span>
  </header>
</template>

<script setup>
</script>

<style scoped>
header {
  width: 100%;
  padding: 10px;
  margin-bottom: 50px;
  background-color: var(--color-primary);
}
#header_title, #header_icons {
  font-size: var(--font-size-title1-desktop);
}
#header_title {
  font-weight: var(--font-weight-title1_3-desktop);
  font-family: var(--font-family-title1_2);
  color: var(--color-secondary);
}
#header_icons {
  color: var(--color-icons);
}
</style>
