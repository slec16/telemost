<template>
    <v-btn-toggle>
        <v-btn @click="startRecording" size="x-small" color="primary">Записать</v-btn>
        <v-btn @click="stopRecording"  size="x-small" color="primary">Стоп</v-btn>
        <v-btn @click="playBack" size="x-small" color="primary">Воспроизвести</v-btn>
    </v-btn-toggle>

    <audio  id="audioPlayback" ></audio>


</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount, computed, watchEffect } from 'vue'
    import { useMediaStore } from '../../stores/media-store'

    const mediaStore = useMediaStore()

    // const audioUrl = ref('')

    let mediaRecorder
    let audioChunks = []
    
    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia( { audio: { deviceId: { exact: mediaStore.audioInputDevice.deviceId } }, video: false } )
                
        mediaRecorder = new MediaRecorder( stream )
        audioChunks = []

        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data)
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
            const audioUrl = URL.createObjectURL(audioBlob)
            const audioPlayback = document.getElementById('audioPlayback')
            console.log(audioUrl)
            audioPlayback.src = audioUrl

        };

        mediaRecorder.start()
    }

    const stopRecording = () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop()
      }
    }

    const playBack = () => {
        const audioPlayback = document.getElementById('audioPlayback')
        audioPlayback.play()
    }

</script>