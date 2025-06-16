<template>
  <v-btn
    @click="buttonHandler"
    color="primary" 
    class="mr-5 w-40" 
  >
    {{ buttonState[currentState] }}
  </v-btn>
  <audio  id="audioPlayback" ></audio>

  <div class="flex w-full" >
      <div class="flex w-full items-center justify-between">
          <div
              v-for="index in numRectangles"
              :key="index"
              class="h-4 w-2 rounded-sm "
              :class="{
                  'bg-green-500' : index <= filledRectangles,
                  'bg-gray-500' : index > filledRectangles
              }"
          ></div>
      </div>
  </div>

</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount, computed, watchEffect } from 'vue'
    import { useMediaStore } from '../../stores/media-store'

    const mediaStore = useMediaStore()

    // const audioUrl = ref('')

    const currentState = ref(0)

    const numRectangles = ref(0)
    const volumeLevel = ref(0)

    let analyser = null
    let audioContext = null
    let animationFrameId = null

    const buttonState = {
      0: 'Записать',
      1: 'Стоп',
      2: 'Воспроизвести'
    }

    let mediaRecorder
    let audioChunks = []

    const buttonHandler = () => {
      switch (currentState.value) {
        case 0: 
          startRecording()
          break
        case 1:
          stopRecording()
          break 
        case 2: 
          playBack()
          break
      }
      currentState.value == 2 ? currentState.value = 0 : currentState.value++
    }
        
    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia( { audio: { deviceId: { exact: mediaStore.audioInputDevice.deviceId } }, video: false } )
        await setupAudioProcessing( { audio: { deviceId: { exact: mediaStore.audioInputDevice.deviceId } }, video: false }, mediaStore.volumeInput )
        if (analyser) {
            updateVolumeLevel() // Запускаем анимацию
        } else {
            console.error("Analyser не инициализирован.")
        }
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
        cancelAnimationFrame(animationFrameId) // Останавливаем анимацию
        if (analyser) {
            analyser.disconnect()  // Отсоединяем узел анализатора
            analyser = null        // Очищаем ссылку на анализатор
        }

        if (audioContext) {
            audioContext.close()   // Закрываем audio context
            audioContext = null    // Очищаем ссылку на audio context
        }
      }
    }

    const playBack = async () => {
        const audioPlayback = document.getElementById('audioPlayback')
        try {
          await audioPlayback.setSinkId( mediaStore.audioOutputDevice.deviceId );
          console.log(`Audio output set to device: ${ mediaStore.audioOutputDevice.deviceId }`)
        } catch (error) {
          console.error('Error setting audio output device:', error)
        }
        audioPlayback.play()
    }

    async function getMicrophoneStream( constraints ) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia( constraints )
        return stream
      } catch (error) {
        console.error("Error accessing microphone:", error)
        return null
      }
    }

    async function setupAudioProcessing( constraints, microVolume ) {
      const stream = await getMicrophoneStream( constraints )

      if (!stream) {
          return
      }

      audioContext = new AudioContext
      const source = audioContext.createMediaStreamSource( stream )
      const gainNode = audioContext.createGain()


      analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048

      source.connect(analyser)
      source.connect(gainNode)
      // gainNode.connect(audioContext.destination)

      gainNode.gain.value = microVolume
    }

    function getVolumeLevel() {
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array( bufferLength )
      analyser.getByteTimeDomainData( dataArray )

      let volume = 0
      for (let i = 0; i < bufferLength; i++) {
        volume += Math.abs( dataArray[i] - 128 ) // Считаем абсолютное значение отклонения от 128
      }

      volume /= bufferLength;
      const normalizedVolume = volume / 128 // Нормализуем в диапазон 0-1

      return normalizedVolume
    }

    function updateVolumeLevel() {
      if ( analyser ) {
        volumeLevel.value = getVolumeLevel(); // Обновляем уровень громкости
        // volumeLevel.value = volumeLevel.value*100
      }
      animationFrameId = requestAnimationFrame( updateVolumeLevel ); // Запрашиваем следующий кадр анимации
    }

    // настройка шкалы

    const filledRectangles = computed(() => {
        return Math.round(volumeLevel.value * numRectangles.value)
    })

    const updateNumRectangles = () => {
      const containerWidth = document.documentElement.clientWidth 

      if(containerWidth < 1600) {
        numRectangles.value = 30
      } else if (containerWidth < 2100) {
        numRectangles.value = 50
      } else {
        numRectangles.value = 80
      }
    }

    watchEffect(() => {
      setupAudioProcessing({ audio: { deviceId: { exact: mediaStore.audioInputDevice.deviceId } }, video: false }, mediaStore.volumeInput )
    })

    onMounted(async() => {
        updateNumRectangles()
        window.addEventListener('resize', updateNumRectangles)

        // await setupAudioProcessing( { audio: { deviceId: { exact: mediaStore.audioInputDevice.deviceId } }, video: false }, mediaStore.volumeInput )
        // if (analyser) {
        //     updateVolumeLevel() // Запускаем анимацию
        // } else {
        //     console.error("Analyser не инициализирован.")
        // }
    })

    onBeforeUnmount(() => {
        // cancelAnimationFrame(animationFrameId) // Останавливаем анимацию
        // if (analyser) {
        //     analyser.disconnect()  // Отсоединяем узел анализатора
        //     analyser = null        // Очищаем ссылку на анализатор
        // }

        // if (audioContext) {
        //     audioContext.close()   // Закрываем audio context
        //     audioContext = null    // Очищаем ссылку на audio context
        // }
    });

</script>