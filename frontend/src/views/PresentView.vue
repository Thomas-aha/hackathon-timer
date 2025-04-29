<template>
  <div class="present-container">
    <a-typography-title :level="1" class="__header">{{ data.title }}</a-typography-title>
    
    <TimerDisplay 
      :timeLeft="timeLeft" 
      :style="data.style"
      :warning="data.settings.showWarning"
      @click="toggleTimer"
    />

    <a-space v-if="data.mode === TIMER_MODES.COUNT_DOWN" class="time-adjustment">
      <a-button @click="adjustTime(30)">+30s</a-button>
      <a-button @click="adjustTime(60)">+1m</a-button>
      <a-button @click="adjustTime(300)">+5m</a-button>
    </a-space>

    <a-space class="timer-controls">
      <a-button @click="toggleTimer">
        <img :src="data.isRunning ? pauseIcon : playIcon" class="control-icon" alt="Play/Pause" />
      </a-button>
      <a-button @click="resetTimer">{{ $t('timer.reset') }}</a-button>
    </a-space>

    <audio ref="alertSound" src="/alert.mp3" preload="auto"></audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import mqtt from 'mqtt'
import { TIMER_STYLES, TIMER_MODES } from '../constants'
import playIcon from '../assets/icons/play.svg'
import pauseIcon from '../assets/icons/pause.svg'
import { API_BASE_URL } from '../config'
import TimerDisplay from '../components/TimerDisplay.vue'

const route = useRoute()
const { presentationId, slideId } = route.query

const data = ref({
  title: '',
  header: '',
  minutes: 0, 
  seconds: 0,
  hours: 0,
  style: TIMER_STYLES.DIGITAL, 
  isRunning: false,
  mode: TIMER_MODES.COUNT_DOWN,
  settings: {
    soundAlert: true,
    visualAlert: true,
    warningThreshold: 10,
    showWarning: false,
  },
})
const timeLeft = ref(data.value.hours * 3600 + data.value.minutes * 60 + data.value.seconds)
const alertSound = ref(null)
let timer = null

// MQTT setup
const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt')

onMounted(async () => {
  async function fetchSettingsAndUpdate() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings?presentationId=${presentationId}&slideId=${slideId}`)
      if (response.ok) {
        const settings = await response.json()
        data.value.title = settings.title || ''
        data.value.minutes = settings.minutes
        data.value.seconds = settings.seconds
        data.value.hours = settings.hours
        data.value.style = settings.style
        data.value.mode = settings.mode || TIMER_MODES.COUNT_DOWN
        data.value.settings = settings.settings || data.value.settings
        timeLeft.value = settings.timeLeft
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  await fetchSettingsAndUpdate()
  client.subscribe(`timer/${presentationId}/${slideId}/#`)

  // Listen for settings update
  client.on('message', (topic, message) => {
    if (topic.endsWith('/settings')) {
      fetchSettingsAndUpdate()
    }
  })

  const handleSpaceBar = (e) => {
    if (
      (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) &&
      !['INPUT', 'TEXTAREA', 'BUTTON'].includes(document.activeElement.tagName)
    ) {
      e.preventDefault();
      toggleTimer();
    }
  };
  window.addEventListener('keydown', handleSpaceBar);

  // Clean up in onUnmounted
  onUnmounted(() => {
    client.end()
    clearInterval(timer)
    window.removeEventListener('keydown', handleSpaceBar);
  });
})

const toggleTimer = () => {
  if (data.value.isRunning) {
    clearInterval(timer)
    client.publish(`timer/${presentationId}/${slideId}/stop`, JSON.stringify({ 
      action: 'stop',
      mode: data.value.mode,
      timeLeft: timeLeft.value
    }))
    // Also update via API
    fetch(`${API_BASE_URL}/api/timer/stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        presentationId,
        slideId,
        mode: data.value.mode,
        timeLeft: timeLeft.value
      })
    })
  } else {
    timer = setInterval(() => {
      if (data.value.mode === TIMER_MODES.COUNT_DOWN) {
        if (timeLeft.value > 0) {
          timeLeft.value--
          
          // Check for warning threshold
          if (data.value.settings.visualAlert && timeLeft.value <= data.value.settings.warningThreshold) {
            data.value.settings.showWarning = true
          }
          
          // Play warning sound
          if (data.value.settings.soundAlert && timeLeft.value === data.value.settings.warningThreshold) {
            playAlertSound()
          }
        } else {
          clearInterval(timer)
          data.value.isRunning = false
          data.value.settings.showWarning = false
          
          // Play end sound
          if (data.value.settings.soundAlert) {
            playAlertSound()
          }
        }
      } else {
        timeLeft.value++
      }
    }, 1000)
    client.publish(`timer/${presentationId}/${slideId}/start`, JSON.stringify({ 
      action: 'start',
      mode: data.value.mode,
      timeLeft: timeLeft.value
    }))
    // Also update via API
    fetch(`${API_BASE_URL}/api/timer/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        presentationId,
        slideId,
        mode: data.value.mode,
        timeLeft: timeLeft.value
      })
    })
  }
  data.value.isRunning = !data.value.isRunning
}

const playAlertSound = () => {
  if (alertSound.value) {
    alertSound.value.currentTime = 0
    alertSound.value.play()
  }
}

const resetTimer = () => {
  clearInterval(timer)
  timeLeft.value = data.value.mode === TIMER_MODES.COUNT_DOWN ? (data.value.hours * 3600 + data.value.minutes * 60 + data.value.seconds) : 0
  data.value.isRunning = false
  data.value.settings.showWarning = false
  client.publish(`timer/${presentationId}/${slideId}/reset`, JSON.stringify({ 
    action: 'reset',
    mode: data.value.mode
  }))
}

const adjustTime = (seconds) => {
  if (data.value.mode === TIMER_MODES.COUNT_DOWN) {
    timeLeft.value += seconds
    data.value.hours = Math.floor(timeLeft.value / 3600)
    data.value.minutes = Math.floor((timeLeft.value % 3600) / 60)
    data.value.seconds = timeLeft.value % 60
    if (data.value.seconds + data.value.minutes * 60 + data.value.hours * 3600 > data.value.settings.warningThreshold) {
      data.value.settings.showWarning = false
    }
    client.publish(`timer/${presentationId}/${slideId}/adjust`, JSON.stringify({ seconds }))
  }
}
</script>

<style scoped>
.present-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
}

.timer-display {
  cursor: pointer;
  margin: 24px 0;
  transition: all 0.3s ease;
}

.timer-display.warning {
  animation: pulse 1s infinite;
  color: #ff4d4f;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
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

.mode-selector {
  margin-bottom: 24px;
}

.time-adjustment {
  margin-bottom: 24px;
}

.timer-controls {
  margin-top: 24px;
}

.control-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
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
</style> 