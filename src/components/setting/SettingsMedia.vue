<template>
    <div v-if="promise" class="h-full flex flex-col px-2 py-4">
        <p class="font-bold mb-5">Настройки звука</p>
        <div class="grid grid-cols-2 grid-row-2 gap-2">
            <div class="px-7">
                <p class="mb-2">Устройство ввода</p>
                <v-select
                    class="w-full"
                    :items="audioInputDevices"
                    variant="outlined"
                    density="comfortable"
                    v-model='selectedAudioInput'
                ></v-select>
            </div>
            <div class="px-7">
                <p class="mb-2">Устройство вывода</p>
                <v-select
                    class="w-full"
                    :items="audioOutputDevices"
                    variant="outlined"
                    density="comfortable"
                    v-model="selectedAudioOutput"
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
        <div class="grid grid-cols-2 grid-row-1 gap-2">
            <div class="px-7">
                <p class="mb-2">Камера</p>
                <v-select
                    class="w-full"
                    :items="videoInputDevice"
                    variant="outlined"
                    density="comfortable"
                    v-model="selectedVideoInput"
                ></v-select>
            </div>
            <div class="px-7 pt-2">
                <div class="border rounded-lg w-full h-40 flex items-center justify-center">
                    <v-btn>
                        Проверить камеру
                    </v-btn>
                </div>
            </div>
        </div>

    </div>
    <div class="h-full w-full flex items-center justify-center">
        <v-icon class="animate-spin" size="50" icon="mdi-loading"></v-icon>
    </div>

</template>

<script setup>
    import { ref, onMounted, watchEffect } from "vue"

    const promise = ref(false)

    const soundVolume = ref(0)
    const microVolume = ref(0)

    const audioInputDevices = ref([])
    const audioOutputDevices = ref([])
    const videoInputDevice = ref([])

    const selectedAudioInput = ref({})
    const selectedAudioOutput = ref({})
    const selectedVideoInput = ref({})


    watchEffect(() => {

        // console.log(selectedaudioInput.value)
        //в стору
    })
    

    const enumerateDevice = async () => {

        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then(function(stream) {
                stream.getTracks().forEach(track =>{
                    // console.log(track)
                     track.stop()
                });

                navigator.mediaDevices.enumerateDevices()
                .then(function(devices) {
                    promise.value = true
                    devices.forEach((device) => {
                        if( device.kind == 'audioinput' ) {
                            audioInputDevices.value.push({
                                ...device,
                                title: device.label,
                                value: device.deviceId
                            })
                            if(device.label.includes("умолчанию")) {
                                selectedAudioInput.value = {
                                    ...device,
                                    title: device.label,
                                    value: device.deviceId
                                }
                            }

                        } else if( device.kind ==  'audiooutput' ) {
                            audioOutputDevices.value.push({
                                ...device,
                                title: device.label,
                                value: device.deviceId
                            })
                            if(device.label.includes("умолчанию")) {
                                selectedAudioOutput.value = {
                                    ...device,
                                    title: device.label,
                                    value: device.deviceId
                                }
                            }
                        } else if( device.kind == 'videoinput' ) {
                            videoInputDevice.value.push({
                                ...device,
                                title: device.label,
                                value: device.deviceId
                            })
                        }
                    })
                    selectedVideoInput.value = {
                        ...videoInputDevice.value[0]
                    }
                })
                .catch(function(err) {
                    console.log("Ошибка при перечислении устройств: " + err.name + ": " + err.message);
                });
            })
            .catch(function(err) {
                console.log("Ошибка при получении доступа к устройствам: " + err.name + ": " + err.message);
                // Обработка отказа в разрешении
            });

    }

    onMounted( () => {
        enumerateDevice()
    })
        
</script>