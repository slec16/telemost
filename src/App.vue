<script setup>
    import { computed, ref, watch, onMounted } from 'vue'
    import HelloWorld from './components/HelloWorld.vue'
    import ListOfUsers from './components/ListOfUsers.vue'

    const theme = ref('light')
    
    const changeTheme = () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    const drawer = ref(true)
    const rail = ref(true)

    const listSelected = ref("")

    const userName = ref("")

    const listOfUsers = ref([])



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

    onMounted(() => {
        // console.log(makeid(5))
        userName.value = makeid(5)
    })

    let myWs
    myWs = new WebSocket('ws://localhost:9000');

    myWs.addEventListener("open", (e) => {
        myWs.send(JSON.stringify(userName.value))
    })

    myWs.addEventListener("message",async(e) => {
        let message = JSON.parse(e.data)
        if(message instanceof Array) listOfUsers.value = message
    })
    

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
                :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
                text=""
                slim
                @click="changeTheme"
            ></v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" :rail="rail" permanent >
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
        <v-main>
            main content
        </v-main>

    </v-app>
</template>
