<template>
  <div class="timer-display" :class="{ 'warning': warning }" @click="$emit('click')">
    <DigitalTimer 
      v-if="style === TIMER_STYLES.DIGITAL" 
      :timeLeft="timeLeft"
    />
    <IconTimer 
      v-else-if="style === TIMER_STYLES.ICON" 
      :timeLeft="timeLeft"
    />
    <FlipClockTimer 
      v-else-if="style === TIMER_STYLES.FLIP_CLOCK" 
      :timeLeft="timeLeft"
    />
  </div>
</template>

<script setup>
import { TIMER_STYLES } from '../constants';
import DigitalTimer from './DigitalTimer.vue';
import IconTimer from './IconTimer.vue';
import FlipClockTimer from './FlipClockTimer.vue';

defineProps({
  timeLeft: {
    type: Number,
    required: true
  },
  style: {
    type: String,
    required: true
  },
  warning: {
    type: Boolean,
    default: false
  },
});
</script>

<style scoped>
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
</style> 