import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DigitalTimer from './DigitalTimer.vue';

describe('DigitalTimer', () => {
  it('renders mm:ss when under 1 hour', () => {
    const wrapper = mount(DigitalTimer, {
      props: { timeLeft: 125 } // 2:05
    });
    expect(wrapper.text()).toBe('02:05');
  });

  it('renders hh:mm:ss when 1 hour or more', () => {
    const wrapper = mount(DigitalTimer, {
      props: { timeLeft: 3661 } // 1:01:01
    });
    expect(wrapper.text()).toBe('01:01:01');
  });
}); 