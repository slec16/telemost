<template>

    <v-navigation-drawer :rail="rail" permanent>
        <v-list 
            v-model:selected="selectedUser"
            
        >
            <v-list-item 
                v-for="(item, i) in listOfUsers" 
                :key="i" 
                :value="item"
                color="primary"
                prepend-icon="mdi-account-circle"
                :disabled="item == selectedUser"
            >

                {{ item }}
            </v-list-item>
        </v-list>

    </v-navigation-drawer>


</template>


<script setup>
    import { computed, ref, watch, watchEffect, reactive } from 'vue'

    const { listOfUsers, rail } = defineProps(["listOfUsers", "rail"])


    const selectedUser = ref("")



    watchEffect(() => {
        console.log(listOfUsers)
    })


</script>