import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FlipClockTimer from './FlipClockTimer.vue';

// Mock FlipDigit
vi.mock('./FlipDigit.vue', () => ({ default: { template: '<div class="flip-digit-mock" />', props: ['value'] } }));

describe('FlipClockTimer', () => {
  it('renders four FlipDigit components for mm:ss', () => {
    const wrapper = mount(FlipClockTimer, {
      props: { timeLeft: 125 } // 2:05
    });
    const digits = wrapper.findAll('.flip-digit-mock');
    expect(digits.length).toBe(4);
  });

  it('passes correct values to FlipDigit', () => {
    const wrapper = mount(FlipClockTimer, {
      props: { timeLeft: 125 } // 2:05
    });
    // 02:05
    const digitValues = [
      wrapper.vm.minutes.charAt(0),
      wrapper.vm.minutes.charAt(1),
      wrapper.vm.seconds.charAt(0),
      wrapper.vm.seconds.charAt(1)
    ];
    expect(digitValues).toEqual(['0', '2', '0', '5']);
  });
}); 