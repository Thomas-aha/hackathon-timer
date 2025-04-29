<template>
  <div class="typographic-clock">
    <span class="minutes">{{ minutes }}</span>
    <span class="colon">:</span>
    <span class="seconds">{{ seconds }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  timeLeft: {
    type: Number,
    required: true
  },
});

const minutes = computed(() => Math.floor(props.timeLeft / 60).toString().padStart(2, '0'));
const seconds = computed(() => (props.timeLeft % 60).toString().padStart(2, '0'));
</script>

<style scoped>
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
</style> 