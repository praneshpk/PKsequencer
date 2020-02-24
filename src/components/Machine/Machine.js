import React, {
  useLayoutEffect, useState, useRef, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';


import Sample from '../Sample/Sample';
import './Machine.scss';
import {
  toggleSample, dragSample, setPattern, setBpm,
} from '../../actions';

export default function Machine() {
  const SAMPLES = 16;
  const VOICES = SAMPLES;

  const dispatch = useDispatch();
  const pattern = useSelector((state) => state.global.pattern);
  const bpm = useSelector((state) => state.global.bpm);
  const drag = useRef(Array(SAMPLES).fill(false));


  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const voices = Array(VOICES).fill(audioContext.createOscillator());
  const [beat, setBeat] = useState(0);
  const focused = useRef(0);

  // Creates list of sample components
  function renderSamples(on) {
    const ret = [];
    for (let i = 0; i < SAMPLES; i++) {
      ret.push(Sample({
        focused: focused.current === i,
        press: () => {
          dispatch(toggleSample(focused.current, i));
        },
        dragStart: (evt) => {
          evt.preventDefault();
          if (!drag.current[i]) {
            drag.current[i] = true;
            dispatch(toggleSample(focused.current, i));
          }
        },
        dragEnd: (evt) => {
          evt.preventDefault();
          drag.current = drag.current.map(() => false);
          console.log('drop');
        },
        selected: pattern[focused.current][i],
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
      setBeat((prev) => (prev + 1) % SAMPLES);
      setSamples(renderSamples(beat));
    }
    requestRef.current = window.requestAnimationFrame(step);
  }

  useEffect(() => {
    dispatch(setPattern(Array(SAMPLES).fill(0).map(() => Array(SAMPLES).fill(false))));
    dispatch(setBpm(120));
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
  }, [dispatch]);

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
      <div>{bpm}</div>
    </div>
  );
}
