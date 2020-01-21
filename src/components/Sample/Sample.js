import React, { useState } from 'react';
import './Sample.scss';

export default function Sample({
  osc, on, selected = false, id,
}) {
  const labelId = `sample-${id}`;
  return (
    <div className={`Sample ${selected ? 'on' : ''}`}>
      {/* <input
        type="radio"
        name="sample"
        id={labelId}
      /> */}
      {/* <label htmlFor={labelId} /> */}
    </div>
  );
}
