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
  const minutes = Math.floor(props.timeLeft / 60);
  const seconds = props.timeLeft % 60;
 
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});
</script>

<style scoped>
.digital-clock {
  font-size: 6rem;
  font-family: monospace;
  color: #333;
}
</style> 