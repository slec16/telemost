<template>

    <v-navigation-drawer permanent>
        <v-list 
            v-model:selected="selectedUser"
            
        >
            <v-list-item 
                v-for="(item, i) in listOfFriends" 
                :key="i" 
                :value="item"
                color="primary"
                prepend-icon="mdi-account"
                :disabled="item == selectedUser"
                :to='`chat/${item.id}`'
            >

                {{ item.name }}
            </v-list-item>
        </v-list>

    </v-navigation-drawer>
    <div>Friends component</div>

</template>


<script setup>
    import { computed, ref, watch, watchEffect, reactive } from 'vue'

    // const { listOfUsers } = defineProps(["listOfUsers"])

    // fetch запрос для получения списка друзей
    const listOfFriends = ref([{
        name: 'Roma',
        id: 1,
    }])

    const selectedUser = ref("")



    // watchEffect(() => {
    //     console.log(listOfUsers)
    // })


</script>