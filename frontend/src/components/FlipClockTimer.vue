<template>
  <div class="flip-clock">
    <div class="flip-clock-container">
      <div class="flip-unit-container">
        <div class="digit-container">
          <FlipDigit :value="minutes.charAt(0)"/>
        </div>
        <div class="digit-container">
          <FlipDigit :value="minutes.charAt(1)"/>
        </div>
        <div class="separator">:</div>
        <div class="digit-container">
          <FlipDigit :value="seconds.charAt(0)"/>
        </div>
        <div class="digit-container">
          <FlipDigit :value="seconds.charAt(1)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import FlipDigit from './FlipDigit.vue';

const props = defineProps({
  timeLeft: {
    type: Number,
    required: true
  }
});

// We only show minutes and seconds in the GIF
const minutes = computed(() => {
  const mins = Math.floor(props.timeLeft / 60).toString().padStart(2, '0');
  return mins;
});

const seconds = computed(() => {
  const secs = (props.timeLeft % 60).toString().padStart(2, '0');
  return secs;
});
</script>

<style scoped>
.flip-clock {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flip-clock-container {
  display: flex;
  align-items: center;
  background-color: #222;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.flip-unit-container {
  display: flex;
  align-items: center;
}

.digit-container {
  margin: 0 2px;
}

.separator {
  font-size: 60px;
  font-weight: bold;
  color: #fff;
  opacity: 0.5;
  margin: 0 5px;
  position: relative;
  top: -5px;
}
</style> 