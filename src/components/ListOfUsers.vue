<template>

    <v-navigation-drawer permanent>
        <v-list 
            v-model:selected="selectedUser"
            
        >
            <v-list-item 
                v-for="(item, i) in listOfUsers" 
                :key="i" 
                :value="item"
                color="primary"
                prepend-icon="mdi-account"
                :disabled="item == selectedUser"
            >

                {{ item }}
            </v-list-item>
        </v-list>

    </v-navigation-drawer>


</template>


<script setup>
    import { computed, ref, watch, watchEffect, reactive } from 'vue'

    const { listOfUsers } = defineProps(["listOfUsers"])


    const selectedUser = ref("")



    // watchEffect(() => {
    //     console.log(listOfUsers)
    // })


</script>