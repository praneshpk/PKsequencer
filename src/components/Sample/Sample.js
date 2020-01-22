import React from 'react';
import './Sample.scss';

export default function Sample({
  osc, on = false, focused = false, selected = false, press,
}) {
  return (
    <button
      className={`Sample${focused ? ' focused' : ''}${on ? ' on' : ''}${selected ? ' selected' : ''}`}
      onClick={press}
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
