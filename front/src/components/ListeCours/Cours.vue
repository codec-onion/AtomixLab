<template>
  <article>
    <a :href="infosCours.url" target="_blank">
      <!-- Bouton modifier (admin uniquement) -->
      <button
        v-if="authStore.isAdmin"
        @click.prevent="handleEdit"
        class="edit-button"
        title="Modifier ce cours"
      >
        <font-awesome-icon icon="fa-solid fa-pen-to-square" />
      </button>
      <button
        v-if="authStore.isAdmin"
        @click.prevent="handleDelete"
        class="delete-button"
        title="Supprimer ce cours"
      >
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </button>

      <div class="header">
        <div class="session_niveau">
          <p class="niveau_scolaire">{{ infosCours.niveauScolaire }}</p>
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

      <p class="theme"><u>Thème:</u> {{ infosCours.thematique }}</p>
      <h2 class="title">{{ infosCours.title }}</h2>
      <p class="infos">Cliquez sur la carte pour télécharger</p>
      <font-awesome-icon class="icon" icon="fa-solid fa-graduation-cap" />
    </a>
  </article>
</template>

<script setup>
import { deleteCours } from '@/_services/donnees.service'
import { useAuthStore } from '@/stores/auth'
import { useDonnesStore } from '@/stores/donnes'

const props = defineProps(['infosCours'])
const emit = defineEmits(['openEditModal'])

const authStore = useAuthStore()
const { deleteCourseInStore } = useDonnesStore()

const handleEdit = () => {
  emit('openEditModal', props.infosCours.id)
}

const handleDelete = async () => {
  const deletedCourse = await deleteCours(props.infosCours.id)
  deleteCourseInStore(props.infosCours.id)
}
</script>

<style scoped>
a {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-between;
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
p,
.type_icon,
h2,
h3 {
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
  font-size: var(--font-size-text-secondary-desktop);
}
.type_icon {
  font-size: 60px;
  color: var(--color-icons);
}
.niveau_scolaire, .theme {
  font-size: var(--font-size-text-primary-desktop);
}
.session,
.infos {
  font-size: var(--font-size-text-secondary-desktop);
}
.infos {
  text-align: center;
}
h2 {
  font-size: 36px;
  font-weight: bold;
}

/* Boutons modifier et supprimer */
.edit-button {
  position: absolute;
  top: 10px;
  right: 60px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: var(--color-secondary);
  color: white;
  font-size: 16px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0;
}

.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: red;
  color: white;
  font-size: 16px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0;
}

a:hover .edit-button,
a:hover .delete-button {
  opacity: 1;
}

.edit-button:hover {
  background-color: var(--color-icons);
  transform: scale(1.1);
}
.delete-button:hover {
  transform: scale(1.1);
}
</style>
