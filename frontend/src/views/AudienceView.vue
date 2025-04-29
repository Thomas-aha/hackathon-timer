<template>
  <div class="audience-container">
    <a-typography-title :level="2" class="timer-title">{{ data.title }}</a-typography-title>
    <TimerDisplay 
      :timeLeft="data.timeLeft" 
      :style="data.style"
    />
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import mqtt from 'mqtt'
import { API_BASE_URL } from '../config'
import { TIMER_STYLES, TIMER_MODES } from '../constants'
import TimerDisplay from '../components/TimerDisplay.vue'

const route = useRoute()
const { presentationId, slideId } = route.query

const data = reactive({
  title: '',
  hours: 0,
  minutes: 0,
  seconds: 0,
  style: TIMER_STYLES.DIGITAL,
  timeLeft: 0,
  mode: TIMER_MODES.COUNT_DOWN
})
let timer = null

// MQTT setup
const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt')

onMounted(async () => {
  async function fetchSettingsAndUpdate() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings?presentationId=${presentationId}&slideId=${slideId}`)
      if (response.ok) {
        const settings = await response.json()
        data.title = settings.title || ''
        data.style = settings.style
        data.timeLeft = settings.timeLeft
        data.hours = Math.floor(data.timeLeft / 3600)
        data.minutes = Math.floor((data.timeLeft % 3600) / 60)
        data.seconds = data.timeLeft % 60
        const startTime = settings.startTime
        const timeNow = Date.now()
        if (settings.isRunning) {
          const timeLeft = settings.timeLeft - (timeNow - startTime)/1000
          startTimer(timeLeft)
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  await fetchSettingsAndUpdate()
  client.subscribe(`timer/${presentationId}/${slideId}/#`)

  client.on('message', (topic, message) => {
    const receivedData = JSON.parse(message.toString())
    const { mode, timeLeft } = receivedData
    
    if (mode !== undefined) {
      data.mode = mode
    }
    
    if (topic.endsWith('/start')) {
      startTimer(timeLeft)
    } else if (topic.endsWith('/stop')) {
      stopTimer(timeLeft)
    } else if (topic.endsWith('/reset')) {
      resetTimer()
    } else if (topic.endsWith('/adjust')) {
      if (data.seconds) {
        data.timeLeft += data.seconds
      }
    } else if (topic.endsWith('/settings')) {
      fetchSettingsAndUpdate()
    }
  })
})

onUnmounted(() => {
  client.end()
  clearInterval(timer)
})

const startTimer = (timeLeft) => {
  timer = setInterval(() => {
    if (data.mode === TIMER_MODES.STOPWATCH) {
      data.timeLeft++
    } else if (timeLeft > 0) {
      timeLeft--
      data.timeLeft = timeLeft
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

const stopTimer = (timeLeft) => {
  clearInterval(timer)
  data.timeLeft = timeLeft
}

const resetTimer = () => {
  clearInterval(timer)
  if (data.mode === TIMER_MODES.COUNT_DOWN) {
    const totalSeconds = (data.hours * 3600) + (data.minutes * 60) + data.seconds
    data.timeLeft = totalSeconds
  } else {
    data.timeLeft = 0
  }
}

// For icon clock style
const timeValue = computed(() => {
  if (data.timeLeft >= 3600) {
    return Math.floor(data.timeLeft / 3600)
  } else if (data.timeLeft >= 60) {
    return Math.floor(data.timeLeft / 60)
  } else {
    return data.timeLeft
  }
})

const timeUnit = computed(() => {
  if (data.timeLeft >= 3600) {
    return timeValue.value === 1 ? 'hour' : 'hours'
  } else if (data.timeLeft >= 60) {
    return timeValue.value === 1 ? 'min' : 'mins'
  } else {
    return timeValue.value === 1 ? 'sec' : 'secs'
  }
})
</script>

<style scoped>
.audience-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
}

.timer-display {
  margin-bottom: 2rem;
}

.clock-face {
  width: 100%;
  height: 100%;
  position: relative;
}

.hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom;
  background: #333;
}

.hour-hand {
  width: 4px;
  height: 30%;
}

.minute-hand {
  width: 3px;
  height: 40%;
}

.second-hand {
  width: 2px;
  height: 45%;
  background: red;
}

.digital-clock {
  font-size: 6rem;
  font-family: monospace;
  color: #333;
}

.typographic-clock {
  font-size: 8rem;
  font-family: 'Arial', sans-serif;
  color: #333;
}

.typographic-clock .colon {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.audience-info {
  text-align: center;
  margin-top: 2rem;
}

.audience-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.audience-emoji {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.audience-team {
  font-size: 1.2rem;
  color: #666;
}

.icon-clock {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3875D9, #17A5DF, #22C3E6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(34, 195, 230, 0.3);
}

.icon-clock-inner {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background-color: #F9F5F5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.time-value {
  font-size: 4rem;
  font-weight: bold;
  color: #3875D9;
  line-height: 1;
}

.time-unit {
  font-size: 1.2rem;
  color: #8FB1DF;
  text-transform: uppercase;
  margin-top: 5px;
}

.timer-title {
  margin-bottom: 16px;
  text-align: center;
}
</style> 