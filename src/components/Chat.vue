<template>
    <div class="flex flex-col h-full">

        <div class="border-b flex flex-row h-fit py-3 w-full justify-between">
            <div>
                Current route path:{{ $route.fullPath }}  User {{ $route.params.id }}
            </div>
            <v-btn
                color="secondary"
                variant="plain"
                icon="mdi-phone"
                @click="console.log(mediaStore.volumeInput, mediaStore.audioInputDevice)"
        ></v-btn>
        </div>
        <div class="h-full">chat zone</div>
        <div class="h-fit px-5 py-3 border-t">
            <v-text-field
                placeholder="Сообщение"
                hide-details
            >
                <template v-slot:prepend-inner>
                    <v-btn
                        variant="plain"
                        icon="mdi-plus"
                    ></v-btn>
                    <v-divider vertical class="ml-3"></v-divider>
                </template>

                <template v-slot:append-inner>
                    <v-btn
                        variant="plain"
                        icon="mdi-sticker-emoji"
                    ></v-btn>
                    <v-btn
                        variant="plain"
                        icon="mdi-emoticon-cool-outline"
                    ></v-btn>
                    <v-divider vertical class="mx-3"></v-divider>
                    <v-btn
                        color="secondary"
                        variant="plain"
                        icon="mdi-send-circle"
                    ></v-btn>
                </template>
            </v-text-field>
        </div>
    </div>
    
</template>

<script setup>
    import { useMediaStore } from "../stores/media-store"

    const mediaStore = useMediaStore()



</script>