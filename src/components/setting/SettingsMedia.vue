<template>
    <div v-if="promise" class="h-full flex flex-col px-2 py-4">
        <p class="font-bold mb-5">Настройки звука</p>
        <div class="grid grid-cols-2 grid-row-2 gap-2">
            <div class="px-7">
                <p class="mb-2">Устройство ввода</p>
                <v-select
                    :items="audioInputLabels"
                    variant="outlined"
                    density="comfortable"
                    v-model='selectedAudioInput'
                ></v-select>
            </div>
            <div class="px-7">
                <p class="mb-2">Устройство вывода</p>
                <v-select
                    class="w-full"
                    :items="audioOutputLabels"
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

        <div>
            <p class="font-bold mb-5">Проверка микрофона</p>
            <div class="flex flex-row px-7">
                <MediaRecord />
                <MicrophoneLevel />
            </div>
        </div>
        <v-divider class="my-5"></v-divider>
        <p class="font-bold mb-5">Настройки видео</p>
        <div class="grid grid-cols-2 grid-row-1 gap-2">
            <div class="px-7">
                <p class="mb-2">Камера</p>
                <v-select
                    class="w-full"
                    :items="videoInputLabels"
                    variant="outlined"
                    density="comfortable"
                    v-model="selectedVideoInput"
                ></v-select>
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
    import MicrophoneLevel from "./MicrophoneLevel.vue"
    import MediaRecord from "./MediaRecord.vue"
    import { useMediaStore } from "../../stores/media-store"
    import { throttle } from "../../utils/throttle"
    
    const mediaStore = useMediaStore()

    const promise = ref(false)

    const videoRef = useTemplateRef('check-video-ref')

    const checkVideo = ref(false)

    const microVolume = ref(null)
    const soundVolume = ref(null)

    const sensitivityValue = ref(0.75)

    const audioInputDevices = ref([])
    const audioInputLabels = ref([])

    const audioOutputDevices = ref([])
    const audioOutputLabels = ref([])

    const videoInputDevice = ref([])
    const videoInputLabels = ref([])

    const selectedAudioInput = ref('')
    const selectedAudioOutput = ref('')
    const selectedVideoInput = ref('')



    const checkVideoHandler = async () => {
        const stream = await getMediaStream( { audio: false, video: true } )
        // console.log(stream)
            if (stream) {
            checkVideo.value = true
            videoRef.value.srcObject = stream
            videoRef.value.onloadedmetadata = () => {
            videoRef.value.play() 
            }
        } else {
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
        devices.forEach( ( device ) => {
            if( device.kind == 'audioinput' ) {

                audioInputDevices.value.push( device )
                audioInputLabels.value.push( device.label )

            } else if( device.kind ==  'audiooutput' ) {

                audioOutputDevices.value.push( device )
                audioOutputLabels.value.push( device.label )

            } else if( device.kind == 'videoinput' ) {

                videoInputDevice.value.push( device )
                videoInputLabels.value.push( device.label )

            }
        })

        if( selectedAudioInput.value === '' ) selectedAudioInput.value = audioInputLabels.value[0]
        if( selectedAudioOutput.value === '' ) selectedAudioOutput.value = audioOutputLabels.value[0]
        if( selectedVideoInput.value === '' ) selectedVideoInput.value = videoInputLabels.value[0]

        promise.value = true

    }



    // const setupAudio = async( selectedInputDevice, selectedOutputDevice ) => {
        
    //     // console.log(selectedInputDevice , selectedOutputDevice )

    //     if( selectedInputDevice == undefined || selectedOutputDevice == undefined ) return

    //     const stream = await getMediaStream( { audio: { deviceId: { exact: selectedInputDevice.deviceId } }, video: false } )

    //     if( !stream ) return

    //     const audioTracks = stream.getAudioTracks()

    //     if (audioTracks.length === 0) {
    //         console.warn("No audio tracks found.")
    //         return
    //     }

    //     const audioContext = new window.AudioContext();
    //     const source = audioContext.createMediaStreamSource(stream);
    //     const gainNode = audioContext.createGain()

    //     source.connect(gainNode); // Connect the source to the gain node
    //     gainNode.connect(audioContext.destination); // Connect the gain node to the output (speakers)


    //     console.log("setup func")
    //     microVolume.value = gainNode.gain.value //current value state


    //     stream.getTracks().forEach(track => track.stop())

    // } 

    // TODO: Убрать и перенестие все в mediarecorder здесь только сохранять в стору
    const setMicroVolume = async( value, selectedInputDevice ) => {

 
        mediaStore.volumeInput = value

        if( selectedInputDevice == undefined ) return
        const stream = await getMediaStream( { audio: { deviceId: { exact: selectedInputDevice.deviceId } }, video: false } )
        if( !stream ) return

        const audioTracks = stream.getAudioTracks()

        if (audioTracks.length === 0) {
            console.warn("No audio tracks found.")
            return
        }
        
        const audioContext = new window.AudioContext()
        const source = audioContext.createMediaStreamSource(stream)
        const gainNode = audioContext.createGain()

        source.connect(gainNode)
        gainNode.connect(audioContext.destination) 

        gainNode.gain.value = value

        stream.getTracks().forEach(track => track.stop())
        
    }


    watchEffect(() => {
        const currentDevice = audioInputDevices.value.find( el => el.label === selectedAudioInput.value)
        if( currentDevice == undefined ) return
        mediaStore.audioInputDevice = currentDevice
    })

    watchEffect(() => {
        const currentDevice = audioOutputDevices.value.find( el => el.label === selectedAudioOutput.value)
        if( currentDevice == undefined ) return
        mediaStore.audioOutputDevice = currentDevice
    })

    watchEffect(() => {
        const currentDevice = videoInputDevice.value.find( el => el.label === selectedVideoInput.value)
        if( currentDevice == undefined ) return
        mediaStore.videoDevice = currentDevice
    })

    watchEffect(() => {
        if( microVolume.value === null ) return
        setMicroVolume( microVolume.value, mediaStore.audioInputDevice )
    })

    watchEffect(() => {
        if( soundVolume.value === null ) return
        mediaStore.volumeOutput = soundVolume.value
    })

    onMounted( () => {

        if( mediaStore.audioInputDevice !== null ) {
            selectedAudioInput.value = mediaStore.audioInputDevice.label
        } 
        if( mediaStore.audioOutputDevice !== null ) {
            selectedAudioOutput.value = mediaStore.audioOutputDevice.label
        }
        if( mediaStore.videoDevice !== null ) {
            selectedVideoInput.value = mediaStore.videoDevice.label
        }

        // volume input
        if( mediaStore.volumeInput !== null ) {
            microVolume.value = mediaStore.volumeInput
        } else {
            microVolume.value = 0.5
        }

        if( mediaStore.volumeOutput !== null ) {
            soundVolume.value = mediaStore.volumeOutput
        } else {
            soundVolume.value = 0.5
        }

        enumerateDevices()
        
    })
        
</script>