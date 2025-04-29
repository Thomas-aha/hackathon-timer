import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FlipDigit from './FlipDigit.vue';

describe('FlipDigit', () => {
  it('renders current and next value', () => {
    const wrapper = mount(FlipDigit, {
      props: { value: '3' }
    });
    expect(wrapper.text()).toContain('3');
  });

  it('animates when value changes', async () => {
    const wrapper = mount(FlipDigit, {
      props: { value: '3' }
    });
    wrapper.setProps({ value: '4' });
    // Animation is async, but we can check that nextValue updates
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.nextValue).toBe('4');
  });
}); 