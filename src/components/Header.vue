<template>
  <header>
    <span id="header_title">AtomixLab</span>
    <span id="header_icons">
      <font-awesome-icon icon="fa-solid fa-explosion" />
      <font-awesome-icon icon="flask-vial" />
    </span>
  </header>
</template>

<script setup></script>

<style scoped>
header {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-primary);
}
#header_title {
  font-family: var(--font-family-title1_2);
  font-size: var(--font-size-title1-desktop);
  font-weight: var(--font-weight-title1_3-desktop);
  color: var(--color-secondary);
}
#header_icons {
  font-family: var(--font-family-title1_2);
  font-size: var(--font-size-title1-desktop);
  font-weight: var(--font-weight-title1_3-desktop);
  color: var(--color-icons);
}
</style>
