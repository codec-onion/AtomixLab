<template>
  <article>
    <a href="#">
      <div class="header">
        <div class="session_niveau">
          <p class="niveau-scolaire">{{ infosCours.niveauScolaire }}</p>
          <p class="session">{{ infosCours.session }}</p>
        </div>
        <div class="type">
          <font-awesome-icon
            class="type_icon"
            v-if="infosCours.type === 'Chimie'"
            icon="fa-solid fa-flask-vial"
          />
          <font-awesome-icon
            class="type_icon"
            v-else-if="infosCours.type === 'Physique'"
            icon="fa-solid fa-explosion"
          />
          <font-awesome-icon class="type_icon" v-else icon="fa-solid fa-book" />
          <p class="type_text">{{ infosCours.type }}</p>
        </div>
      </div>

      <p class="theme">{{ infosCours.thematique }}</p>
      <p class="title">{{ infosCours.title }}</p>
      <p class="infos">Cliquez sur la carte pour télécharger</p>
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
  flex-wrap: wrap;
  width: 350px;
  height: 350px;
  background-color: var(--color-primary);
  color: var(--color-secondary);
  text-decoration: none;
  margin-bottom: 30px;
  padding: 20px;
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
p, .type_icon {
  z-index: 1;
}
.header {
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: space-between;
}
.session_niveau,
.type {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.type {
  align-items: center;
}
.type_icon {
  font-size: 80px;
  color: var(--color-icons);
}
</style>
