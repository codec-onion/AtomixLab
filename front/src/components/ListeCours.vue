<template>
  <section class="margin_section">
    <header>
      <div class="line"></div>
      <select name="sessionChoisie">
        <option value="">Session</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="hamster">Hamster</option>
        <option value="parrot">Parrot</option>
        <option value="spider">Spider</option>
        <option value="goldfish">Goldfish</option>
      </select>
      <select name="sessionChoisie">
        <option value="">Niveau Scolaire</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="hamster">Hamster</option>
        <option value="parrot">Parrot</option>
        <option value="spider">Spider</option>
        <option value="goldfish">Goldfish</option>
      </select>
      <select name="sessionChoisie">
        <option value="">Thème</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="hamster">Hamster</option>
        <option value="parrot">Parrot</option>
        <option value="spider">Spider</option>
        <option value="goldfish">Goldfish</option>
      </select>
      <div>
        <select name="sessionChoisie">
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
  </section>
</template>

<script setup></script>

<style scoped>
section {
  margin-bottom: 50px;
  position: relative;
  padding: 20px;
  background: linear-gradient(var(--color-primary), var(--color-tertiary));
}
.line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-icons);
}
select:not(select:last-of-type) {
  margin-right: 20px;
}
select {
  margin-bottom: 20px;
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
div {
  position: relative;
  display: inline-block;
}
.font_awesome {
  color: var(--color-icons);
  font-size: 40px;
  position: absolute;
  right: -5px;
  pointer-events: none;
}
</style>
