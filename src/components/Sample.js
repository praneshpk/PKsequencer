import React, { useState } from 'react';

export default function Sample({ x, y, w, h }) {
  const [freq, setFreq] = useState(200);
  const [toggle, setToggle] = useState(false);
  const p5Params = {
    bgOn: [199, 185, 110],
    bgOff: [149, 134, 58],
    x, y, w, h
  }
}