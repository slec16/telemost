<script setup>
    import { ref } from 'vue'
    import HelloWorld from './components/HelloWorld.vue'



    const theme = ref('light')

    const changeTheme = () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    const drawer = ref(true)
    const rail = ref(true)
</script>


<template>
    <v-app :theme="theme">

        <v-app-bar title="App bar">
            <v-spacer></v-spacer>
            <v-btn
                :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
                text=""
                slim
                @click="changeTheme"
            ></v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
            <v-list>
                <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/88.jpg"
                    title="John Leider">
                    <template v-slot:append>
                        <v-btn  @click.stop="rail = !rail"><-</v-btn>
                    </template>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <v-list-item prepend-icon="mdi-home-city" value="home">Home</v-list-item>
                <v-list-item prepend-icon="mdi-account"  value="channels">Channels</v-list-item>
                <v-list-item prepend-icon="mdi-account-group-outline" value="friends">Friends</v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-main>
            main content
        </v-main>

    </v-app>
</template>
