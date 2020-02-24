const global = (state = {}, action) => {
  let pattern;
  switch (action.type) {
    case 'SET_PATTERN':
      return {
        ...state,
        pattern: action.pattern,
      };
    case 'TOGGLE_SAMPLE':
      pattern = [...state.pattern];
      pattern[action.bank][action.sample] = !pattern[action.bank][action.sample];
      return {
        ...state,
        pattern,
      };
    case 'DRAG_SAMPLE':
      // pattern = [...state.pattern];
      // pattern[action.bank][action.sample] = !pattern[action.bank][action.sample];

      // let { drag } = state;
      // if (drag) {
      //   pattern[action.bank][action.sample] = !drag[action.bank][action.sample];
      // } else {
      //   drag = [...state.pattern];
      // }
      return {
        ...state,
        drag: action.sample,
      };
    case 'DROP_SAMPLE':
      return {
        ...state,
        drag: null,
      };
    case 'SET_BPM':
      return {
        ...state,
        bpm: action.bpm,
      };
    default:
      return state;
  }
};
export default global;
