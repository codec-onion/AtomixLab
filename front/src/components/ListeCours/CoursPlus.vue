<template>
  <article>
    <a href="" @click.prevent>
      <p>Ajouer un cours</p>
      <p>+</p>
      <font-awesome-icon class="icon" icon="fa-solid fa-graduation-cap" />
    </a>
  </article>
</template>

<script setup>
import { defineProps } from 'vue'
const { infosCours } = defineProps(['infosCours'])
</script>

<style scoped>
a {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 350px;
  height: 350px;
  background-color: var(--color-primary);
  color: var(--color-secondary);
  text-decoration: none;
  margin-bottom: 30px;
  padding: 20px;
  border-style: dashed;
  border-width: 10px;
  border-radius: 20px;
  box-shadow: 10px 10px 10px lightgray;
  transition:
    box-shadow 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}
a:hover {
  box-shadow: none;
  transform: translate(10px, 10px);
}
.icon {
  display: block;
  width: 90%;
  height: 100%;
  position: absolute;
  color: var(--color-tertiary);
  filter: blur(3px);
}
p {
  z-index: 1;
  font-size: 80px;
  text-align: center;
}

</style>
