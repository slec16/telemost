<template>
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

</template>

<script setup>
    import { computed, ref, watch, watchEffect, reactive } from 'vue'

    const { listOfUsers } = defineProps(["listOfUsers"])


    const selectedUser = ref("")



</script>