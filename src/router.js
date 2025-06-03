import { createMemoryHistory, createRouter } from 'vue-router'

import Settings from './components/setting/Settings.vue'
import SettingsMedia from './components/setting/SettingsMedia.vue'
import Language from './components/setting/Language.vue'
import View from './components/setting/View.vue'
import Push from './components/setting/Push.vue'
import Account from './components/setting/Account.vue'
import Conf from './components/setting/conf.vue'
import Chat from './components/Chat.vue'
import Message from './components/Message.vue'
import Groups from './components/Groups.vue'
import Main from './components/Main.vue'
import ListOfUsers from './components/ListOfUsers.vue'

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
                component: SettingsMedia,
            },
            {
                path: '/settings/push',
                component: Push,
            },
            {
                path: '/settings/view',
                component: View,
            },
            {
                path: '/settings/language',
                component: Language,
            },
            {
                path: '/settings/account',
                component: Account,
            },
            {
                path: '/settings/conf',
                component: Conf,
            }
        ]
    },
    { 
        path: '/friends',
        component: ListOfUsers,
    },
    {   
        path: '/message',
        component: Message
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