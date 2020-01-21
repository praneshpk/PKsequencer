import React, { useEffect, useState, useRef } from 'react';
import Sample from '../Sample/Sample';
import './Machine.scss';

export default function Machine() {
  const FPS = 60;
  const SAMPLES = 16;
  const VOICES = SAMPLES;
  const [bpm, setBpm] = useState(120);

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const voices = Array(VOICES).fill(audioContext.createOscillator());

  // Creates list of sample components
  function renderSamples(on) {
    const ret = [];
    for (let i = 0; i < SAMPLES; i++) {
      ret.push(Sample({
        id: i,
        osc: voices[i % VOICES],
        on: on === i,
      }));
    }
    return ret;
  }

  const [samples, setSamples] = useState(renderSamples());

  // setSamples(renderSamples(0));
  let start = null;
  const last = useRef(0);
  const requestRef = useRef();
  const [beat, setBeat] = useState(0);
  // Run for ten seconds
  function step(now) {
    if (!start) start = now;

    if (now - last >= 1000 / (bpm / 60)) {
      last.current = now;
      setBeat((beat + 1) % SAMPLES);
      // setSamples(renderSamples(beat));
      console.log('thump');
    }
    requestRef.current = window.requestAnimationFrame(step);
  }


  useEffect(() => {
    requestRef.current = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="Machine">
      <div className="samples">
        {samples}
        <div>{beat}</div>
      </div>
    </div>
  );
}
