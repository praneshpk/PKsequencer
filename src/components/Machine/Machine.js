import React, {
  useLayoutEffect, useState, useRef, useEffect,
} from 'react';
import Sample from '../Sample/Sample';
import './Machine.scss';

export default function Machine() {
  const SAMPLES = 16;
  const VOICES = SAMPLES;
  const [bpm, setBpm] = useState(120);

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const voices = Array(VOICES).fill(audioContext.createOscillator());
  const [beat, setBeat] = useState(0);
  const focused = useRef(0);
  const [patterns, setPatterns] = useState(Array(SAMPLES).fill(0).map(() => Array(SAMPLES).fill(false)));

  // Creates list of sample components
  function renderSamples(on) {
    const ret = [];
    for (let i = 0; i < SAMPLES; i++) {
      ret.push(Sample({
        focused: focused.current === i,
        press: () => {
          patterns[focused.current][i] = !patterns[focused.current][i];
        },
        selected: patterns[focused.current][i],
        osc: voices[i % VOICES],
        on: on === i,
      }));
    }
    return ret;
  }

  const [samples, setSamples] = useState([]);

  const last = useRef(0);
  const requestRef = useRef();


  function step(now) {
    if (now - last.current >= (1000 / (bpm / 60)) / 4) {
      last.current = now;
      // beat.current = (beat.current + 1) % SAMPLES;
      setBeat((prev) => (prev + 1) % SAMPLES);
      setSamples(renderSamples(beat));
    }
    requestRef.current = window.requestAnimationFrame(step);
  }

  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.key === 'ArrowLeft') {
        if (focused.current > 0) {
          focused.current--;
        } else {
          focused.current = SAMPLES - 1;
        }
      }
      if (e.key === 'ArrowRight') {
        if (focused.current < SAMPLES - 1) {
          focused.current++;
        } else {
          focused.current = 0;
        }
      }
      console.log(e.key);
    };
  }, []);

  useLayoutEffect(() => {
    requestRef.current = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(requestRef.current);
  });

  return (
    <div className="Machine">
      <div className="samples">
        {samples}
      </div>
      <div>{beat}</div>

    </div>
  );
}
