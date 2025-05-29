import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import "@mdi/font/css/materialdesignicons.css"; 
import "@fortawesome/fontawesome-free/css/all.css";

import App from './App.vue'

const pinia = createPinia()

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

createApp(App).use(vuetify).use(pinia).mount('#app')
