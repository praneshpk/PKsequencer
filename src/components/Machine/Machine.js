import React, { useEffect, useState } from 'react';
import Sample from '../Sample/Sample';
import './Machine.scss';

export default function Machine() {
  const FPS = 60;
  const SAMPLES = 16;
  const VOICES = SAMPLES;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const voices = Array(VOICES).fill(audioContext.createOscillator());

  // Creates list of sample components
  function renderSamples() {
    const ret = [];
    for (let i = 0; i < SAMPLES; i++) {
      ret.push(Sample({
        id: i,
        osc: voices[i % VOICES],
      }));
    }
    return ret;
  }

  const [samples, setSamples] = useState(renderSamples());


  // setSamples(renderSamples(0));


  useEffect(() => {
  });

  return (
    <div className="Machine">
      <div className="samples">
        {samples}
      </div>
    </div>
  );
}
