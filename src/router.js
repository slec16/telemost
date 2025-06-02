import { createMemoryHistory, createRouter } from 'vue-router'

import Settings from './components/Settings.vue'
import Chat from './components/Chat.vue'
import SettingsMedia from './components/SettingsMedia.vue'
import Groups from './components/Groups.vue'
import Main from './components/Main.vue'

const routes = [
    {
        path: '/',
        component: Main
    },
    {
        path: '/settings',
        component: Settings,
        children: [
            {
                path: '/settings/media',
                name: 'Media',
                component: SettingsMedia,
            }
        ]
    },
    { 
        path: '/chat',
        component: Chat,
    },
    { 
        path: '/groups',
        component: Groups,
    }

]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router