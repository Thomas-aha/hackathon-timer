<template>
  <div class="flip-digit">
    <div class="digit-container">
      <!-- Top half (shows the next digit) -->
      <div class="card bg-up">
        <div class="inner">
          <div class="content">{{ nextValue }}</div>
        </div>
      </div>
      
      <!-- Bottom half (shows current digit) -->
      <div class="card bg-down">
        <div class="inner">
          <div class="content">{{ currentValue }}</div>
        </div>
      </div>
      
      <!-- Flipping part -->
      <div class="card flip" :style="`transform: rotateX(-${degree}deg);`">
        <div class="front inner">
          <div class="content">{{ currentValue }}</div>
        </div>
        <div class="back inner">
          <div class="content">{{ nextValue }}</div>
        </div>
      </div>
      
      <!-- Center divider -->
      <div class="center-line"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  value: {
    type: String,
    required: true
  }
});

const currentValue = ref(props.value);
const nextValue = ref(props.value);
const degree = ref(0);
const isAnimating = ref(false);

// Animation function
const flip = () => {
  if (degree.value < 180) {
    degree.value += 15; // Increased animation speed
    requestAnimationFrame(flip);
  } else {
    degree.value = 0;
    currentValue.value = nextValue.value;
    isAnimating.value = false;
  }
};

// Watch for value changes
watch(() => props.value, (newValue, oldValue) => {
  if (newValue === oldValue || isAnimating.value) {
    return;
  }
  
  nextValue.value = newValue;
  isAnimating.value = true;
  
  requestAnimationFrame(flip);
});
</script>

<style scoped>
.flip-digit {
  position: relative;
  width: 55px;
  height: 80px;
  perspective: 400px;
  display: inline-block;
}

.digit-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
}

/* Center divider line */
.center-line {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  top: 50%;
  z-index: 10;
}

/* Card styles */
.card {
  position: absolute;
  width: 100%;
  height: 50%;
  text-align: center;
  font-size: 60px;
  transform-style: preserve-3d;
}

.flip {
  top: 0;
  transform-origin: bottom;
  z-index: 5; /* Higher z-index to ensure it's on top during animation */
}

.bg-up {
  top: 0;
  z-index: 1;
}

.bg-down {
  top: 50%;
  z-index: 1;
}

/* Inner card styles */
.inner {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  overflow: hidden;
  background-color: #222;
}

.front {
  border-radius: 4px 4px 0 0;
}

.back {
  border-radius: 4px 4px 0 0;
  transform: rotateX(180deg);
}

.bg-up .inner {
  border-radius: 4px 4px 0 0;
}

.bg-down .inner {
  border-radius: 0 0 4px 4px;
}

/* Content positioning */
.content {
  color: white;
  font-weight: bold;
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.3);
  line-height: 80px;
}

.bg-up .content {
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: -40px;
}

.bg-down .content {
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 40px;
}

.front .content {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
}

.back .content {
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: -40px;
}
</style> 