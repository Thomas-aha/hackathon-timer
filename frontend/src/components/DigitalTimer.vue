<template>
  <div class="digital-clock">
    {{ formattedTime }}
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

const formattedTime = computed(() => {
  const hours = Math.floor(props.timeLeft / 3600);
  const minutes = Math.floor((props.timeLeft % 3600) / 60);
  const seconds = props.timeLeft % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
});
</script>

<style scoped>
.digital-clock {
  font-size: 6rem;
  font-family: monospace;
  color: #333;
}
</style> 