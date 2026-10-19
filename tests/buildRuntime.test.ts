import { describe, it, expect } from 'vitest';
import {
  buildRate,
  ElementJob,
  getBotAssignedGroup,
  isBotActiveAtTime,
} from '../src/components/builder/buildRuntime';

describe('buildRuntime staged 3-phase orchestration', () => {
  it('calculates build rate with bounded minimum', () => {
    const rate = buildRate(100);
    expect(rate).toBeGreaterThanOrEqual(450);
  });

  it('assigns correct groups to the 3 specialized bots', () => {
    // Bot 0: Weaver (frames and outer boxes)
    expect(getBotAssignedGroup(0)).toContain('dialogue-frame');
    // Bot 1: Typist (text and lore)
    expect(getBotAssignedGroup(1)).toContain('dialogue-text');
    // Bot 2: Armorer (badges and buttons)
    expect(getBotAssignedGroup(2)).toContain('dialogue-badge');
  });

  it('stages bot activations by start delay', () => {
    // At t = 0.1s, only Bot 0 is active
    expect(isBotActiveAtTime(0, 0.1)).toBe(true);
    expect(isBotActiveAtTime(1, 0.1)).toBe(false);
    expect(isBotActiveAtTime(2, 0.1)).toBe(false);

    // At t = 0.7s, Bot 0 and Bot 1 are active
    expect(isBotActiveAtTime(0, 0.7)).toBe(true);
    expect(isBotActiveAtTime(1, 0.7)).toBe(true);
    expect(isBotActiveAtTime(2, 0.7)).toBe(false);

    // At t = 1.0s, all 3 bots are active
    expect(isBotActiveAtTime(0, 1.0)).toBe(true);
    expect(isBotActiveAtTime(1, 1.0)).toBe(true);
    expect(isBotActiveAtTime(2, 1.0)).toBe(true);
  });
});

