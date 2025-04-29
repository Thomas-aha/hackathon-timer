<template>
  <div class="timer-container">
    <div class="timer-display" :class="timerStyle">
      {{ formatTime(timeLeft) }}
    </div>
    <div class="timer-controls">
      <button @click="startTimer" :disabled="isRunning">{{ $t('timer.start') }}</button>
      <button @click="stopTimer" :disabled="!isRunning">{{ $t('timer.stop') }}</button>
      <button @click="resetTimer">{{ $t('timer.reset') }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const presentationId = route.query.presentationId
const slideId = route.query.slideId

const timeLeft = ref(0)
const isRunning = ref(false)
const timerStyle = ref('digital')

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

onMounted(() => {
  const settings = JSON.parse(localStorage.getItem(`timer_${presentationId}_${slideId}`))
  if (settings) {
    timeLeft.value = settings.timeLimit * 60
    timerStyle.value = settings.style
  }
})

let timer = null

const startTimer = () => {
  if (!isRunning.value) {
    isRunning.value = true
    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        clearInterval(timer)
        isRunning.value = false
      }
    }, 1000)
  }
}

const stopTimer = () => {
  clearInterval(timer)
  isRunning.value = false
}

const resetTimer = () => {
  stopTimer()
  const settings = JSON.parse(localStorage.getItem(`timer_${presentationId}_${slideId}`))
  if (settings) {
    timeLeft.value = settings.timeLimit * 60
  }
}
</script>

<style scoped>
.timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

.timer-display {
  font-size: 4rem;
  font-weight: bold;
}

.timer-controls {
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 