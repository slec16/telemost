<template>
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
    import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
    import { useMediaStore } from '../../stores/media-store';

    // const { audioInputDevice, microVoume } = defineProps( [ "audioInputDevice", "microVoume" ] )

    const mediaStore = useMediaStore()

    const volumeLevel = ref(0)
    let analyser = null
    let audioContext = null
    let animationFrameId = null

    const numRectangles = ref(0)

    async function getMicrophoneStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia( { audio: { deviceId: { exact: mediaStore.audioInputDevice.deviceId } }, video: false } )
        console.log(stream)
        return stream
      } catch (error) {
        console.error("Error accessing microphone:", error)
        return null
      }
    }

    async function setupAudioProcessing() {
      const stream = await getMicrophoneStream()

      if (!stream) {
        return
      }

      audioContext = new AudioContext
      const source = audioContext.createMediaStreamSource(stream)

      analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048

      source.connect(analyser)
    }

    function getVolumeLevel() {
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteTimeDomainData(dataArray)

      let volume = 0
      for (let i = 0; i < bufferLength; i++) {
        volume += Math.abs(dataArray[i] - 128) // Считаем абсолютное значение отклонения от 128
      }

      volume /= bufferLength;
      const normalizedVolume = volume / 128 // Нормализуем в диапазон 0-1

      return normalizedVolume
    }

    function updateVolumeLevel() {
      if (analyser) {
        volumeLevel.value = getVolumeLevel(); // Обновляем уровень громкости
        // volumeLevel.value = volumeLevel.value*100
      }
      animationFrameId = requestAnimationFrame(updateVolumeLevel); // Запрашиваем следующий кадр анимации
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

    onMounted(async() => {
        updateNumRectangles()
        window.addEventListener('resize', updateNumRectangles)
        await setupAudioProcessing()
        if (analyser) {
            updateVolumeLevel() // Запускаем анимацию
        } else {
            console.error("Analyser не инициализирован.")
        }
    })

    onBeforeUnmount(() => {
        cancelAnimationFrame(animationFrameId) // Останавливаем анимацию
        if (analyser) {
            analyser.disconnect()  // Отсоединяем узел анализатора
            analyser = null        // Очищаем ссылку на анализатор
        }

        if (audioContext) {
            audioContext.close()   // Закрываем audio context
            audioContext = null    // Очищаем ссылку на audio context
        }
    });

</script>