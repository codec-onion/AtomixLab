<template>
  <article>
    <p class="niveau-scolaire">{{ infosCours.niveauScolaire }}</p>
    <p class="type">{{ infosCours.type }}</p>
    <p class="session">{{ infosCours.session }}</p>
    <p class="theme">{{ infosCours.thematique }}</p>
    <p class="title">{{ infosCours.title }}</p>
    <p class="infos">Cliquez sur la carte pour télécharger</p>
  </article>
</template>

<script setup>
import { defineProps } from 'vue'
const { infosCours } = defineProps(['infosCours'])
</script>

<style scoped>
article {
  display: flex;
  flex-wrap: wrap;
  width: 350px;
  height: 350px;
  background-color:aliceblue;
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 10px 10px 10px lightgray;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
}
article:hover {
  box-shadow: none;
  transform: translate(10px, 10px);
}
</style>
