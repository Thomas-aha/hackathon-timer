<template>
  <div class="icon-clock">
    <div class="icon-clock-inner">
      <div class="time-value">{{ timeValue }}</div>
      <div class="time-unit">{{ timeUnit }}</div>
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

const timeValue = computed(() => {
  if (props.timeLeft >= 3600) {
    return Math.floor(props.timeLeft / 3600);
  } else if (props.timeLeft >= 60) {
    return Math.floor(props.timeLeft / 60);
  } else {
    return props.timeLeft;
  }
});

const timeUnit = computed(() => {
  if (props.timeLeft >= 3600) {
    return timeValue.value === 1 ? 'hour' : 'hours';
  } else if (props.timeLeft >= 60) {
    return timeValue.value === 1 ? 'min' : 'mins';
  } else {
    return timeValue.value === 1 ? 'sec' : 'secs';
  }
});
</script>

<style scoped>
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