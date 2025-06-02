import { createMemoryHistory, createRouter } from 'vue-router'

// import HomeView from './HomeView.vue'
// import AboutView from './AboutView.vue'
import Settings from './components/Settings.vue'
import Chat from './components/Chat.vue'

const routes = [
  { path: '/settings', component: Settings },
  { path: '/about', component: Chat },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router