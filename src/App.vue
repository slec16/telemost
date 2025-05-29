<script setup>
    import { computed, ref, watch, onMounted, watchEffect } from 'vue'
    import HelloWorld from './components/HelloWorld.vue'
    import ListOfUsers from './components/ListOfUsers.vue'

    import { useSocketStore } from './stores/socket-store'

    const socketStore = useSocketStore()

    const theme = ref('light')
    
    const changeTheme = () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    const drawer = ref(true)
    const rail = ref(true)

    const authDialog = ref(false)

    const listSelected = ref("")

    const userName = ref("")

    const userInfo = ref({})

    
    // watchEffect(() => {
    //     console.log(userInfo.value)
    // })


    const listOfUsers = ref([])

    const authFunc = () => {
        userInfo.value.name = userName.value
        userInfo.value.id = makeid(5)
        console.log(userInfo.value)
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

    // onMounted(() => {
    //     userName.value = makeid(5)
    // })

    // let myWs
    // myWs = new WebSocket('ws://localhost:9000');

    // myWs.addEventListener("open", (e) => {
    //     myWs.send(JSON.stringify(userName.value))
    // })

    // myWs.addEventListener("message",async(e) => {
    //     let message = JSON.parse(e.data)
    //     if(message instanceof Array) listOfUsers.value = message
    // })



    // socketStore.connectWs()
    // socketStore.openWs(userName.value)

</script>


<template>
    <v-app :theme="theme">

        <v-app-bar title="App bar">
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
                                // console.log(userName)
                                authFunc()
                                authDialog = false
                            }"
                        ></v-btn>
                    </template>
                </v-card>
            </v-dialog>

            <v-btn
                :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
                text=""
                slim
                @click="changeTheme"
            ></v-btn>
        </v-app-bar>

        <v-navigation-drawer location="left" v-model="drawer" :rail="rail" permanent >
            <v-list>
                <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/88.jpg"
                    :title="userName">
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav v-model:selected='listSelected'>
                <v-list-item prepend-icon="mdi-home-city" value="home">Home</v-list-item>
                <v-list-item prepend-icon="mdi-account"  value="channels">Channels</v-list-item>
                <v-list-item prepend-icon="mdi-account-group-outline" value="friends">Friends</v-list-item>
            </v-list>
        </v-navigation-drawer>

        <template v-if="listSelected == 'friends'">
            <ListOfUsers 
                :listOfUsers=listOfUsers
                :rail=rail
            />
        </template>

        <v-navigation-drawer location="right">
             <v-list>
                <v-list-item >
                    Друзья онлайн
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav v-model:selected='listSelected'>
                <v-list-item prepend-icon="mdi-account" value="bim-bim">bim-bim</v-list-item>
                <v-list-item prepend-icon="mdi-account"  value="bam-bam">bam-bam</v-list-item>
                <v-list-item prepend-icon="mdi-account" value="boobs">boobs</v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            main content
        </v-main>

    </v-app>
</template>
