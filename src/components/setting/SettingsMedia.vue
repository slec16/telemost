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
                    min="0"
                    max="1"
                ></v-slider>
            </div>
            <div class="px-7">
                <p>Громкость звука</p>
                    <v-slider
                        v-model="soundVolume"
                        color="blue"
                        min="0"
                        max="1"
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
            <div class="px-7">
                <p class="mb-2">Предпросмотр</p>
                <div class="group border rounded-lg w-full min-h-40 flex items-center justify-center">
                    <video ref="check-video-ref" v-show="checkVideo"></video>
                    <v-btn v-if="!checkVideo" @click="checkVideoHandler">
                        Проверить камеру
                    </v-btn>
                    <div v-else class="absolute z-10 invisible group-hover:visible">
                        <v-btn 
                            @click="stopCheckVideoHandler"
                            icon="mdi-close-circle-outline"
                            color="error"
                        ></v-btn>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div v-else class="h-full w-full flex items-center justify-center">
        <v-icon class="animate-spin" size="50" icon="mdi-loading"></v-icon>
    </div>

</template>

<script setup>
    import { ref, onMounted, watchEffect, useTemplateRef } from "vue"

    const promise = ref(false)

    const videoRef = useTemplateRef('check-video-ref')

    const checkVideo = ref(false)

    const microVolume = ref(0)
    const soundVolume = ref(1)

    const audioInputDevices = ref([])
    const audioOutputDevices = ref([])
    const videoInputDevice = ref([])

    const selectedAudioInput = ref({})
    const selectedAudioOutput = ref({})
    const selectedVideoInput = ref({})


    watchEffect(() => {

        // console.log(microVolume.value)
        // console.log(soundVolume.value)
        //в стору значения (через троттл)

    })

    const checkVideoHandler = async () => {
        const stream = await getMediaStream( { audio: false, video: true } );
        console.log(stream)
            if (stream) {
            checkVideo.value = true
            videoRef.value.srcObject = stream;
            // Optionally, add event listeners for more control:
            videoRef.value.onloadedmetadata = () => {
            videoRef.value.play(); // Start playing the video
            };
        } else {
            // Handle the case where the stream could not be obtained, e.g., show an error message
            console.error("Failed to get stream.");
        }
    }

    const stopCheckVideoHandler = () => {
        if (videoRef.value.srcObject) {
            checkVideo.value = false
            const stream = videoRef.value.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.value.srcObject = null; // Clear the source object
        }
    }
 
    const getMediaStream = async ( constraints ) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia( constraints );
            return stream;
        } catch (err) {
            console.error( "Error accessing media devices:", err );
            return null; 
        }

    }

    // const setupVideo = async() => {
    //     const stream = await getMediaStream( { audio: false, video: true } );

    //     if( !stream ) return

    //     const videoTracks = stream.getVideoTracks()

    // }

    const setupAudio = async() => {
        const stream = await getMediaStream( { audio: true, video: false } );

        if( !stream ) return

        const audioTracks = stream.getAudioTracks();

        if (audioTracks.length === 0) {
            console.warn("No audio tracks found.");
            return;
        }

        const audioContext = new window.AudioContext();
        const source = audioContext.createMediaStreamSource(stream); 
        const gainNode = audioContext.createGain(); 

        source.connect(gainNode); // Connect the source to the gain node
        gainNode.connect(audioContext.destination); // Connect the gain node to the output (speakers)

        microVolume.value = gainNode.gain.value //current value state

        stream.getTracks().forEach(track => track.stop());
    } 

    const setMicroVolume = ( value ) => {

    }
    

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
        setupAudio()
        // setupVideo()
    })
        
</script>