import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IconTimer from './IconTimer.vue';

describe('IconTimer', () => {
  it('renders seconds and correct unit', () => {
    const wrapper = mount(IconTimer, {
      props: { timeLeft: 5 }
    });
    expect(wrapper.find('.time-value').text()).toBe('5');
    expect(wrapper.find('.time-unit').text()).toBe('secs');
  });

  it('renders minutes and correct unit', () => {
    const wrapper = mount(IconTimer, {
      props: { timeLeft: 120 }
    });
    expect(wrapper.find('.time-value').text()).toBe('2');
    expect(wrapper.find('.time-unit').text()).toBe('mins');
  });

  it('renders hours and correct unit', () => {
    const wrapper = mount(IconTimer, {
      props: { timeLeft: 7200 }
    });
    expect(wrapper.find('.time-value').text()).toBe('2');
    expect(wrapper.find('.time-unit').text()).toBe('hours');
  });
}); 