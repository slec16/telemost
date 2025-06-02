<template>
    <v-navigation-drawer>
        <v-list>

            <v-list-item class="font-bold" >Настройки приложения</v-list-item>

            <v-list-item
                v-for="(item, i) in appsSettingsItems"
                :key="i" 
                :value="item"
                color="primary"
            >
                <span class="pl-5">{{ item }}</span>
            </v-list-item>

            <v-divider></v-divider>
            
            <v-list-item class="font-bold" >Настройки пользователя</v-list-item>
            <v-list-item
                v-for="(item, i) in usersSettingsItems"
                :key="i" 
                :value="item"
                color="primary"
                class="ml-5"
            >
                <span class="pl-5">{{ item }}</span>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item >
                <v-btn
                    variant="plain"
                    color="error"
                >
                    Выйти
                </v-btn>
            </v-list-item>

        </v-list>
    </v-navigation-drawer>
</template>


<script setup>

    const usersSettingsItems = ['Моя учетная запись', 'Конфиденциальность']
    const appsSettingsItems = ['Голос и видео', 'Уведомления', 'Горячие клавиши', 'Внешний вид', 'Язык']

</script>