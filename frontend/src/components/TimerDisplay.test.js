import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TimerDisplay from './TimerDisplay.vue';
import { TIMER_STYLES } from '../constants';

// Mock subcomponents
vi.mock('./DigitalTimer.vue', () => ({ default: { template: '<div class="digital-timer-mock" />' } }));
vi.mock('./IconTimer.vue', () => ({ default: { template: '<div class="icon-timer-mock" />' } }));
vi.mock('./FlipClockTimer.vue', () => ({ default: { template: '<div class="flip-clock-timer-mock" />' } }));

describe('TimerDisplay', () => {
  it('renders DigitalTimer when style is DIGITAL', () => {
    const wrapper = mount(TimerDisplay, {
      props: { timeLeft: 60, style: TIMER_STYLES.DIGITAL }
    });
    expect(wrapper.find('.digital-timer-mock').exists()).toBe(true);
  });

  it('renders IconTimer when style is ICON', () => {
    const wrapper = mount(TimerDisplay, {
      props: { timeLeft: 60, style: TIMER_STYLES.ICON }
    });
    expect(wrapper.find('.icon-timer-mock').exists()).toBe(true);
  });

  it('renders FlipClockTimer when style is FLIP_CLOCK', () => {
    const wrapper = mount(TimerDisplay, {
      props: { timeLeft: 60, style: TIMER_STYLES.FLIP_CLOCK }
    });
    expect(wrapper.find('.flip-clock-timer-mock').exists()).toBe(true);
  });

  it('applies warning class when warning is true', () => {
    const wrapper = mount(TimerDisplay, {
      props: { timeLeft: 60, style: TIMER_STYLES.DIGITAL, warning: true }
    });
    expect(wrapper.classes()).toContain('warning');
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(TimerDisplay, {
      props: { timeLeft: 60, style: TIMER_STYLES.DIGITAL }
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });
}); 