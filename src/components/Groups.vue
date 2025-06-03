<template>

    <v-navigation-drawer permanent>
        <v-list 
            v-model:selected="selectedUser"
            
        >
            <v-list-item 
                v-for="(item, i) in listOfGroups" 
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
    <div>Groups component</div>

</template>


<script setup>
    import { computed, ref, watch, watchEffect, reactive } from 'vue'

    // const { listOfUsers } = defineProps(["listOfUsers"])

    // fetch запрос для получения списка групп
    const listOfGroups = ref([])

    const selectedUser = ref("")



    // watchEffect(() => {
    //     console.log(listOfUsers)
    // })


</script>