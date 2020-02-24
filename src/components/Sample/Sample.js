import React from 'react';
import './Sample.scss';

export default function Sample({
  osc, on = false, focused = false, selected = false, press, dragStart, dragEnd,
}) {
  return (
    <button
      className={`Sample${focused ? ' focused' : ''}${on ? ' on' : ''}${selected ? ' selected' : ''}`}
      onClick={press}
      draggable="true"
      onDragOver={dragStart}
      onDragEnd={dragEnd}
      // onDragOver={drag}

    >
      {/* <input
        type="radio"
        name="sample"
        id={labelId}
      /> */}
      {/* <label htmlFor={labelId} /> */}
    </button>
  );
}
