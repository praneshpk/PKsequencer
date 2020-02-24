export const setPattern = (pattern) => ({
  type: 'SET_PATTERN',
  pattern,
});

export const setBpm = (bpm) => ({
  type: 'SET_BPM',
  bpm,
});

export const toggleSample = (bank, sample) => ({
  type: 'TOGGLE_SAMPLE',
  bank,
  sample,
});

export const dragSample = (bank, sample) => ({
  type: 'DRAG_SAMPLE',
  bank,
  sample,
});
