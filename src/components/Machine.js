import React, { useEffect } from 'react';
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';

import Sample from './Sample';
import AudioUnit from './AudioUnit';
import Button from './Button';

/* eslint-disable no-undef */
export default function Machine() {
  //const metronome;

  const DIM = { x: 1050, y: 640 };
  const FPS = 60;
  const SAMPLES = 16;
  const bass = Array(SAMPLES).fill(new p5.Oscillator());


  const params = {
    bpm: 120,
    step: 0,
    clickables: {
      samples: [],
      buttons: [],
      encoders: [],
    },
    muted: false,
    paused: false,
    focused: 0
  };

  function sketch(p5) {
    let kick;
    p5.preload = () => {
      // p5.soundFormats('mp3', 'wav');
      // kick = new p5.loadSound('/sounds/kick.wav');
    }
    p5.mousePressed = () => {
      console.log(params.clickables.samples);
      for (const key in params.clickables) {
        params.clickables[key].forEach((e, i) => {
          if (key === 'samples') {
            params.clickables[key][params.focused].pattern[i] = e.select();
          } else {
            e.select();
          }
        });
      }
    }
    p5.keyPressed = () => {
      if (p5.keyCode === p5.LEFT_ARROW || p5.keyCode === p5.RIGHT_ARROW) {
        // create temp var
        let samples = params.clickables.samples;
        samples[params.focused].focused = false;
        if (p5.keyCode === p5.LEFT_ARROW) {
          if (params.focused === 0) {
            params.focused = SAMPLES - 1;
          } else {
            params.focused--;
          }
        } else {
          if (params.focused === SAMPLES - 1) {
            params.focused = 0;
          } else {
            params.focused++;
          }
        }
        samples[params.focused].focused = true;
        samples[params.focused].pattern.forEach((e, i) => samples[i].selected = e);
      }
    }
    p5.setup = () => {
      p5.frameRate(FPS);
      p5.createCanvas(window.innerWidth, window.innerHeight);

      // Create samples
      for (let i = 0; i < SAMPLES; i++) {
        params.clickables.samples.push(
          new Sample(p5, {
            sample: new AudioUnit(bass[0], { freq: (i + 1) * 100 }),
            seqLen: SAMPLES,
            x: i * (DIM.x / SAMPLES) + DIM.x / SAMPLES / 4,
            y: DIM.y - DIM.y * .25,
            w: DIM.x / SAMPLES / 2,
            h: DIM.y * .2,
            focused: i === params.focused ? true : false,
          })
        );
      }
      // Play / pause
      params.clickables.buttons.push(
        new Button(p5, () => {
          params.paused = !params.paused;
        }, { x: 200, y: 200 })
      );
    }
    p5.draw = () => {
      canvas(p5);

      // Knobs
      p5.circle(DIM.x * .93, DIM.y * .1, 50, 50);


      if (!params.paused && Math.floor(p5.frameCount % (FPS * 60 / params.bpm / 4)) === 0) {
        if (params.step % 4 === 0) {
          // metronome click
        }
        //console.log(params.step, params.clickables.samples[params.step]);
        // params.clickables.samples[params.step].on = false;
        params.clickables.samples.forEach((e, i) => {
          e.on = false;
        });
        params.step = (params.step + 1) % SAMPLES;


      }

      params.clickables.samples.forEach((e, i) => {
        e.render(i === params.step, params.step);
      });
      for (const button of params.clickables.buttons) {
        button.render();
      }
    }
  }

  function canvas(p5) {
    p5.background(255);
    p5.fill(40, 40, 50);
    p5.rect(0, 0, DIM.x, DIM.y);
    p5.stroke(255);
    p5.line(0, DIM.y * .2, DIM.x, DIM.y * .2);
    p5.line(0, DIM.y * .7, DIM.x, DIM.y * .7);
  }

  useEffect(() => {
    new p5(sketch);
  });

  return (
    <div className="Machine">
      <noscript>Please enable JavaScript to use this application</noscript>
    </div>
  );
}