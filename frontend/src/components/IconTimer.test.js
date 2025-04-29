import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IconTimer from './IconTimer.vue';

describe('IconTimer', () => {
  it('always renders minutes and "MINS" as unit', () => {
    let wrapper = mount(IconTimer, { props: { timeLeft: 5 } });
    expect(wrapper.find('.timer-value').text()).toBe('1');
    expect(wrapper.find('.timer-unit').text()).toBe('MINS');

    wrapper = mount(IconTimer, { props: { timeLeft: 120 } });
    expect(wrapper.find('.timer-value').text()).toBe('2');
    expect(wrapper.find('.timer-unit').text()).toBe('MINS');
  });
}); 