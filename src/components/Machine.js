import React, { useEffect } from 'react';
import p5 from 'p5';

import Sample from './Sample';
import AudioUnit from './AudioUnit';
import Button from './Button';

/* eslint-disable no-undef */
export default function Machine() {
  //const metronome;
  const DIM = { x: 1050, y: 640 };
  const FPS = 60;
  const SAMPLES = 16;


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
    metronome: false,
    focused: 0
  };
  const assets = {
    'metronome': {
      url: 'img/metronome.png',
      sound: new AudioUnit({ freq: 1000, amp: .15 })
    }
  };

  function sketch(p5) {
    p5.preload = () => {
      // Preload image assets
      for (const key in assets) {
        assets[key].img = p5.loadImage(assets[key].url);
      }
    }
    p5.mousePressed = () => {
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
            sample: new AudioUnit({ freq: (i + 1) * 100 }),
            seqLen: SAMPLES,
            x: i * (DIM.x / SAMPLES) + DIM.x / SAMPLES / 4,
            y: DIM.y - DIM.y * .25,
            w: DIM.x / SAMPLES / 2,
            h: DIM.y * .2,
            focused: i === params.focused ? true : false,
          })
        );
      }
      params.clickables.buttons.push(
        new Button(p5, () => {
          params.metronome = !params.metronome;
        }, {
          x: DIM.x / 2,
          y: DIM.y - DIM.y * .35,
          label: assets.metronome.img
        })
      )
      let gutter = params.clickables.buttons[0].w + 10;
      // Play / pause
      params.clickables.buttons.push(
        new Button(p5, () => params.paused = !params.paused, {
          x: DIM.x / 2 + gutter,
          y: DIM.y - DIM.y * .35,
          label: '▶',
          selected: true
        })
      );
    }
    p5.draw = () => {
      canvas(p5);

      // Knobs
      p5.circle(DIM.x * .93, DIM.y * .1, 50, 50);


      if (!params.paused && Math.floor(p5.frameCount % (FPS * 60 / params.bpm / 4)) === 0) {

        params.clickables.samples.forEach((e, i) => {
          e.on = false;
        });
        params.step = (params.step + 1) % SAMPLES;
        if (params.step % 4 === 0 && params.metronome) {
          assets.metronome.sound.start();
        }
      }

      params.clickables.samples.forEach((e, i) => {
        e.render(i === params.step, params.step);
      });

      // Make first button light up to the metronome (play / pause)
      params.clickables.buttons.forEach((e, i) => {
        e.render(i === 0 && params.step % 4 === 0);
      });
    }
  }

  function canvas(p5) {
    p5.background(255);
    p5.fill(40, 40, 50);
    p5.noStroke();
    p5.rect(0, 0, DIM.x, DIM.y);
    p5.strokeWeight(1);
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