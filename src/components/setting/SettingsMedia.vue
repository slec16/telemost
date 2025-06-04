<template>
    <div class="h-full flex flex-col px-2 py-4">
        <p class="font-bold mb-5">Настройки звука</p>
        <div class="grid grid-cols-2 grid-row-2 gap-2">
            <div class="px-7">
                <p class="mb-2">Устройство ввода</p>
                <v-select
                    class="w-full"
                    :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                    variant="outlined"
                    density="comfortable"
                ></v-select>
            </div>
            <div class="px-7">
                <p class="mb-2">Устройство вывода</p>
                <v-select
                    class="w-full"
                    :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                    variant="outlined"
                    density="comfortable"
                ></v-select>
            </div>
            <div class="px-7">
                <p>Громкость микрофона</p> 
                <v-slider
                    v-model="microVolume"
                    color="blue"
                ></v-slider>
            </div>
            <div class="px-7">
                <p>Громкость звука</p>
                    <v-slider
                        v-model="soundVolume"
                        color="blue"
                    ></v-slider>
            </div>
        </div>
        <v-divider class="my-5"></v-divider>
        <p class="font-bold mb-5">Настройки видео</p>

    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue"

    const soundVolume = ref(0)
    const microVolume = ref(0)
    

    const enumerateDevice = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices()
        console.log(devices)
    }

    // onMounted(async() => {
    // })
    enumerateDevice()
        
</script>