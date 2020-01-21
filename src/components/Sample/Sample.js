import React, { useState } from 'react';
import './Sample.scss';

export default function Sample({
  osc, on, selected, id,
}) {
  const labelId = `sample-${id}`;
  return (
    <div className="Sample">
      {/* <input
        type="radio"
        name="sample"
        id={labelId}
      /> */}
      {/* <label htmlFor={labelId} /> */}
    </div>
  );
}
