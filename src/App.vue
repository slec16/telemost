<script setup>
    import { computed, ref, watch, onMounted, watchEffect } from 'vue'
    import HelloWorld from './components/HelloWorld.vue'
    import ListOfUsers from './components/ListOfUsers.vue'
    import OnlineList from './components/OnlineList.vue'

    import { useSocketStore } from './stores/socket-store'
    import { useThemeStore } from './stores/theme-store'

    const socketStore = useSocketStore()
    const themeStore = useThemeStore()

    // const theme = ref('light')
    
    // const changeTheme = () => {
    //     theme.value = theme.value === 'light' ? 'dark' : 'light'
    // }

    const drawer = ref(true)
    const rail = ref(true)

    const authDialog = ref(false)

    const listSelected = ref("")

    const selectedOnline = ref("")
    watchEffect(() => {
        console.log(selectedOnline)
    })

    const userName = ref("")

    const userInfo = ref({})

    const listOfUsers = ref([])

    const signinFunc = () => {
        userInfo.value.name = userName.value
        userInfo.value.id = makeid(5)
        socketStore.connectWs()
        socketStore.openWs(userName.value)
        socketStore.$subscribe((state) => {
            if( state.events.target.recieveMessage ) listOfUsers.value = state.events.target.recieveMessage
        })
    }

    const signoutFunc = () => {
        socketStore.disconnectWs()
    }


    const wsMassegeSubsFunc = (message) => {

    }



    const makeid = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }


</script>


<template>
    <v-app :theme="themeStore.theme">

        <v-app-bar title="Telemost">
            <template v-slot:prepend>
                <v-btn
                    @click="rail = !rail"
                    prepend-icon='mdi-format-list-bulleted'
                ></v-btn>
            </template>

            <v-spacer></v-spacer>
            <v-btn
                @click="authDialog = true"
                icon="mdi-login"
            ></v-btn>

            <v-dialog
                v-model="authDialog"
                width="auto"
            >
                <v-card
                    v-if="socketStore.socketState !== 1"
                    width="400"
                    prepend-icon="mdi-account-circle"
                    text="Введите ваше имя"
                    title="Войти"
                >
                    <v-text-field class="mx-5" v-model="userName"></v-text-field>
                    <template v-slot:actions>
                        <v-btn
                            class="ms-auto"
                            text="Ok"
                            @click="() => {
                                signinFunc()
                                authDialog = false
                            }"
                        ></v-btn>
                    </template>
                </v-card>
                <v-card
                    v-else
                    width="400"
                    prepend-icon="mdi-account-circle"
                    text="Выйти из аккаунта?"
                    title="Выйти"
                >
                    <template v-slot:actions>
                        <v-btn
                            class="ms-auto"
                            text="Ok"
                            @click="() => {
                                // console.log(userName)
                                signoutFunc()
                                authDialog = false
                            }"
                        ></v-btn>
                    </template>
                </v-card>
            </v-dialog>

            <v-btn
                :icon="themeStore.theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
                text=""
                slim
                @click="() => themeStore.changeTheme()"
            ></v-btn>
        </v-app-bar>

        <v-navigation-drawer location="left" v-model="drawer" :rail="rail" permanent >
            <v-list>
                <v-list-item 
                    :title="userName"
                >
                    <template v-slot:prepend>
                        <v-badge :color="socketStore.socketState !== 1 ? 'error' : 'success'" dot>
                            <v-icon icon="mdi-account-circle"></v-icon>
                        </v-badge>
                    </template>
                    <template v-slot:append>
                        <RouterLink to="/settings">
                            <v-btn
                                size="x-small"
                                icon="mdi-cog"
                            ></v-btn>
                        </RouterLink>
                    </template>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav v-model:selected='listSelected'>
                <v-list-item prepend-icon="mdi-home-city" value="home">Группы</v-list-item>
                <v-list-item prepend-icon="mdi-account"  value="channels">Личные сообщения</v-list-item>
                <v-list-item prepend-icon="mdi-account-group-outline" value="friends">Друзья</v-list-item>
            </v-list>
        </v-navigation-drawer>

        <template v-if="listSelected == 'friends'">
            <ListOfUsers 
                :listOfUsers=listOfUsers
            />
        </template>

        <v-navigation-drawer location="right">
             <v-list>
                <v-list-item >
                    Друзья онлайн
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav v-model:selected='selectedOnline'>
                <OnlineList
                    :listOfUsers=listOfUsers
                />
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <!-- main content -->
            <RouterView />
        </v-main>

    </v-app>
</template>
