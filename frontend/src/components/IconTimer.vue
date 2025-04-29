<template>
  <div class="icon-timer-outer">
    <svg class="progress-ring" :width="size" :height="size">
      <defs>
        <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6B1EBB" />
          <stop offset="100%" stop-color="#FF4081" />
        </linearGradient>
      </defs>
      <circle
        class="progress-ring__bg"
        :stroke="bgColor"
        :stroke-width="ringWidth"
        :r="radius"
        :cx="size/2"
        :cy="size/2"
        fill="none"
      />
      <circle
        class="progress-ring__circle"
        :stroke="'url(#timer-gradient)'"
        :stroke-width="ringWidth"
        :r="radius"
        :cx="size/2"
        :cy="size/2"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="0"
        stroke-linecap="round"
      />
    </svg>
    <div class="timer-content">
      <span class="timer-value" :style="gradientTextStyle">{{ timeValue }}</span>
      <span class="timer-unit">MINS</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  timeLeft: {
    type: Number,
    required: true
  }
});

const size = 320;
const ringWidth = 18;
const radius = (size - ringWidth) / 2;
const circumference = 2 * Math.PI * radius;
const bgColor = '#F3F3F7';

const minutes = computed(() => Math.ceil(props.timeLeft / 60));
const timeValue = computed(() => minutes.value);

const gradientTextStyle = {
  background: 'linear-gradient(90deg, #6B1EBB, #FF4081)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 600
};
</script>

<style scoped>
.icon-timer-outer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  width: 340px;
  height: 340px;
  position: relative;
}
.progress-ring {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}
.progress-ring__bg {
  stroke: #F3F3F7;
}

.timer-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}
.timer-value {
  font-size: 90px;
  font-weight: 700;
  letter-spacing: -2px;
  line-height: 1;
  margin-bottom: 8px;
}
.timer-unit {
  font-size: 32px;
  color: #3E3E5A;
  font-weight: 500;
  letter-spacing: 2px;
  margin-top: 0;
}
</style> 