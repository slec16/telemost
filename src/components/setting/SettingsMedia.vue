<template>
    <div v-if="promise" class="h-full flex flex-col px-2 py-4">
        <p class="font-bold mb-5">Настройки звука</p>
        <div class="grid grid-cols-2 grid-row-2 gap-2">
            <div class="px-7">
                <p class="mb-2">Устройство ввода</p>
                <v-combobox
                    :items="audioInputDevices"
                    variant="outlined"
                    density="comfortable"
                    v-model='selectedAudioInput'
                ></v-combobox>
            </div>
            <div class="px-7">
                <p class="mb-2">Устройство вывода</p>
                <v-combobox
                    class="w-full"
                    :items="audioOutputDevices"
                    variant="outlined"
                    density="comfortable"
                    v-model="selectedAudioOutput"
                ></v-combobox>
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

        <div>
            <p>Чувствительность микрофона</p>
            <div>
                <!--TODO -->
                <!-- полоска реагирующая на звук + возможность записи голоса и его прослушивания  -->
                <v-slider
                    v-model="sensitivityValue"
                    color="yellow"
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
                <v-combobox
                    class="w-full"
                    :items="videoInputDevice"
                    variant="outlined"
                    density="comfortable"
                    v-model="selectedVideoInput"
                ></v-combobox>
            </div>
            <div class="px-7">
                <p class="mb-2">Предпросмотр</p>
                <div class="group border rounded-lg w-full min-h-40 flex items-center justify-center">
                    <!-- TODO ограничить размеры окна видео -->
                    <video ref="check-video-ref" class="rounded-md" v-show="checkVideo"></video>
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
    import { useMediaStore } from "../../stores/media-store"
    
    const mediaStore = useMediaStore()

    const promise = ref(false)

    const videoRef = useTemplateRef('check-video-ref')

    const checkVideo = ref(false)

    const microVolume = ref(0.5)
    const soundVolume = ref(0.5)

    const sensitivityValue = ref(0.75)

    const audioInputDevices = ref([])
    const audioOutputDevices = ref([])
    const videoInputDevice = ref([])

    const selectedAudioInput = ref({})
    const selectedAudioOutput = ref({})
    const selectedVideoInput = ref({})



    const checkVideoHandler = async () => {
        const stream = await getMediaStream( { audio: false, video: true } )
        console.log(stream)
            if (stream) {
            checkVideo.value = true
            videoRef.value.srcObject = stream
            // Optionally, add event listeners for more control:
            videoRef.value.onloadedmetadata = () => {
            videoRef.value.play(); // Start playing the video
            }
        } else {
            // Handle the case where the stream could not be obtained, e.g., show an error message
            console.error("Failed to get stream.")
        }
    }

    const stopCheckVideoHandler = () => {
        if (videoRef.value.srcObject) {
            checkVideo.value = false
            const stream = videoRef.value.srcObject
            const tracks = stream.getTracks()
            tracks.forEach(track => track.stop())
            videoRef.value.srcObject = null
        }
    }
 
    const getMediaStream = async ( constraints ) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia( constraints )
            return stream
        } catch (err) {
            console.error( "Error accessing media devices:", err )
            return null
        }

    }



    const enumerateDevices = async() => {

        const streams = await getMediaStream( { audio: true, video: true } )
        streams.getTracks().forEach( ( track ) => {
            track.stop()
        } )

        const devices = await navigator.mediaDevices.enumerateDevices()

        // 
        devices.forEach((device) => {
            if( device.kind == 'audioinput' ) {
                audioInputDevices.value.push({
                    title: device.label,
                    value: device,
                })
                if(device.label.includes("умолчанию")) {
                    selectedAudioInput.value = {
                        title: device.label,
                        value: device
                    }
                }

            } else if( device.kind ==  'audiooutput' ) {
                audioOutputDevices.value.push({
                    title: device.label,
                    value: device
                })
                if(device.label.includes("умолчанию")) {
                    selectedAudioOutput.value = {
                        title: device.label,
                        value: device
                    }
                }
            } else if( device.kind == 'videoinput' ) {
                videoInputDevice.value.push({
                    title: device.label,
                    value: device
                })
            }
        })

        selectedVideoInput.value = {
            ...videoInputDevice.value[0]
        }

        promise.value = true

    }



    const setupAudio = async( selectedInputDevice, selectedOutputDevice ) => {
        
        // console.log(selectedInputDevice , selectedOutputDevice )

        if( selectedInputDevice == undefined || selectedOutputDevice == undefined ) return

        const stream = await getMediaStream( { audio: { deviceId: { exact: selectedInputDevice.deviceId } }, video: false } )

        if( !stream ) return

        const audioTracks = stream.getAudioTracks()

        if (audioTracks.length === 0) {
            console.warn("No audio tracks found.")
            return
        }

        const audioContext = new window.AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const gainNode = audioContext.createGain()

        source.connect(gainNode); // Connect the source to the gain node
        gainNode.connect(audioContext.destination); // Connect the gain node to the output (speakers)


        console.log("setup func")
        microVolume.value = gainNode.gain.value //current value state


        stream.getTracks().forEach(track => track.stop())

    } 

    // const setMicroVolume = async( value, selectedInputDevice ) => {

    //     if( selectedInputDevice == undefined ) return
    //     const stream = await getMediaStream( { audio: { deviceId: { exact: selectedInputDevice.deviceId } }, video: false } )
    //     if( !stream ) return

    //     const audioTracks = stream.getAudioTracks()

    //     if (audioTracks.length === 0) {
    //         console.warn("No audio tracks found.")
    //         return
    //     }
        
    //     const audioContext = new window.AudioContext()
    //     const source = audioContext.createMediaStreamSource(stream)
    //     const gainNode = audioContext.createGain()

    //     source.connect(gainNode); // Connect the source to the gain node
    //     gainNode.connect(audioContext.destination); // Connect the gain node to the output (speakers)

    //     gainNode.gain.value = value

    //     stream.getTracks().forEach(track => track.stop())
        
    // }

    const setMicroVolume = ( value, selectedInputDevice ) => {  
        if( selectedInputDevice == undefined ) return

        mediaStore.audioInputDevice = selectedInputDevice
        console.log(selectedInputDevice)
        mediaStore.volumeInput = value
    }


    const setSoundVolume = ( value, selectedOutputDevice ) => {  
        if( selectedOutputDevice == undefined ) return

        mediaStore.audioOutputDevice.value = selectedOutputDevice
        console.log(selectedOutputDevice)
        mediaStore.volumeOutput = value
    }

    watchEffect(( ) => {
        console.log(selectedAudioInput.value)
    })
    // watchEffect(() => {

    //     // в стору значения (через троттл)

    //     // просто собирать значения с инпутов и записывать их в строру
    //     // при создании wrtc забирать из сторы эти параметры и применять их

    //     setMicroVolume( microVolume.value, selectedAudioInput.value )
    // })

    // watchEffect(() => {
    //     setSoundVolume( soundVolume.value, selectedAudioOutput.value )
    // })

    // watchEffect(() => {
    //     mediaStore.videoDevice = selectedVideoInput.value
    // })




    onMounted( () => {

        enumerateDevices()

        
    })
        
</script>