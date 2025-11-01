<template>
  <header>
    <div class="line"></div>
    <div class="select">
      <select name="session">
        <option value="">Session</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="hamster">Hamster</option>
        <option value="parrot">Parrot</option>
        <option value="spider">Spider</option>
        <option value="goldfish">Goldfish</option>
      </select>
      <font-awesome-icon class="font_awesome" icon="fa-solid fa-circle-chevron-down" />
    </div>
    <div class="select">
      <select name="niveauScolaire">
        <option value="">Niveau Scolaire</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="hamster">Hamster</option>
        <option value="parrot">Parrot</option>
        <option value="spider">Spider</option>
        <option value="goldfish">Goldfish</option>
      </select>
      <font-awesome-icon class="font_awesome" icon="fa-solid fa-circle-chevron-down" />
    </div>
    <div class="select">
      <select name="theme">
        <option value="">Thème</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="hamster">Hamster</option>
        <option value="parrot">Parrot</option>
        <option value="spider">Spider</option>
        <option value="goldfish">Goldfish</option>
      </select>
      <font-awesome-icon class="font_awesome" icon="fa-solid fa-circle-chevron-down" />
    </div>
    <div class="select">
      <select name="chapitre">
        <option value="">Chapitre</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="hamster">Hamster</option>
        <option value="parrot">Parrot</option>
        <option value="spider">Spider</option>
        <option value="goldfish">Goldfish</option>
      </select>
      <font-awesome-icon class="font_awesome" icon="fa-solid fa-circle-chevron-down" />
    </div>
  </header>
</template>

<script setup></script>

<style scoped>
.line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-icons);
}
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
.font_awesome:hover {
  transform: rotate(180deg);
}
</style>
