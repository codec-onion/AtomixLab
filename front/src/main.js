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
  faCircleChevronUp
} from '@fortawesome/free-solid-svg-icons'
library.add(faFlaskVial, faExplosion, faCircleChevronDown, faCircleChevronUp)

/* Styles CSS global */
import "./assets/styles/reset.css"
import "./assets/styles/base.css"
import "./assets/styles/variables.css"
import "./assets/styles/class.css"


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')