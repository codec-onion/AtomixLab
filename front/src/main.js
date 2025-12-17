import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

/* FontAwesome Icons */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faFlaskVial,
  faExplosion,
  faCircleChevronDown,
  faCircleChevronUp,
  faGraduationCap,
  faBook,
  faXmark,
  faEye,
  faEyeSlash,
  faCircleExclamation,
  faSpinner,
  faCheck,
  faPenToSquare,
  faPen,
  faTrash,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
library.add(
  faFlaskVial,
  faExplosion,
  faCircleChevronDown,
  faCircleChevronUp,
  faGraduationCap,
  faBook,
  faXmark,
  faEye,
  faEyeSlash,
  faCircleExclamation,
  faSpinner,
  faCheck,
  faPenToSquare,
  faPen,
  faTrash,
  faTriangleExclamation
)

/* Vue select pour les listes déroulantes */
import VueSelect from "vue-select"
import 'vue-select/dist/vue-select.css'

/* Styles CSS global */
import "./assets/styles/reset.css"
import "./assets/styles/base.css"
import "./assets/styles/variables.css"
import "./assets/styles/class.css"


const app = createApp(App)

app.use(createPinia())
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component("v-select", VueSelect)
  .mount('#app')