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
                :to="item.route"
            >
                <span class="pl-5">{{ item.title }}</span>
            </v-list-item>

            <v-divider></v-divider>
            
            <v-list-item class="font-bold" >Настройки пользователя</v-list-item>
            <v-list-item
                v-for="(item, i) in usersSettingsItems"
                :key="i" 
                :value="item"
                color="primary"
                :to="item.route"
            >
                <span class="pl-5">{{ item.title }}</span>
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

    import { useSocketStore } from '../../stores/socket-store'

    const socketStore = useSocketStore()

    const usersSettingsItems = [{title: 'Моя учетная запись', route: '/settings/account'}, {title: 'Конфиденциальность', route: '/settings/conf'}]
    const appsSettingsItems = [
        { title: 'Голос и видео', route: '/settings/media' },
        { title: 'Уведомления', route: '/settings/push' }, 
        { title: 'Внешний вид', route: '/settings/view' }, 
        { title: 'Язык', route: '/settings/language' }
    ]

</script>