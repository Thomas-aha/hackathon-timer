import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TypographicTimer from './TypographicTimer.vue';

describe('TypographicTimer', () => {
  it('renders only minutes and seconds when under 1 hour', () => {
    const wrapper = mount(TypographicTimer, {
      props: { timeLeft: 125 } // 2:05
    });
    expect(wrapper.find('.minutes').text()).toBe('02');
    expect(wrapper.find('.seconds').text()).toBe('05');
  });

  it('renders minutes, and seconds when 1 hour or more', () => {
    const wrapper = mount(TypographicTimer, {
      props: { timeLeft: 3661 } // 1:01:01
    });
    expect(wrapper.find('.minutes').text()).toBe('61');
    expect(wrapper.find('.seconds').text()).toBe('01');
  });
}); 