<template>
    <v-navigation-drawer>
        <v-list>

            <v-list-item class="font-bold" >Настройки приложения</v-list-item>

            <v-list-item
                v-for="(item, i) in appsSettingsItems"
                :key="i" 
                :value="item"
                color="primary"
                class="p-0"
            >
                <RouterLink :to="item.route">
                    <span class="pl-5">{{ item.title }}</span>
                    <!-- {{ item.title }} -->
                </RouterLink>
            </v-list-item>

            <v-divider></v-divider>
            
            <v-list-item class="font-bold" >Настройки пользователя</v-list-item>
            <v-list-item
                v-for="(item, i) in usersSettingsItems"
                :key="i" 
                :value="item"
                color="primary"
            >
                <span class="pl-5">{{ item }}</span>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item >
                <v-btn
                    variant="plain"
                    color="error"
                    :disabled="socketStore.socketState !== 1"
                >
                    Выйти
                </v-btn>
            </v-list-item>

        </v-list>
    </v-navigation-drawer>

    <RouterView />
</template>


<script setup>

    import { useSocketStore } from '../stores/socket-store'

    const socketStore = useSocketStore()

    const usersSettingsItems = ['Моя учетная запись', 'Конфиденциальность']
    const appsSettingsItems = [{ title: 'Голос и видео', route: '/settings/media' },
        { title: 'Уведомления', route: '/push' }, 
        { title: 'Горячие клавиши', route: '/hotkey' }, 
        { title: 'Внешний вид', route: '/view' }, 
        { title: 'Язык', route: '/language' }
    ]

</script>