import React, { useEffect } from 'react';
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';

/* eslint-disable no-undef */
export default function Machine() {
  const bass = new p5.Oscillator();
  const dim = (x, y) => [window.innerWidth * x, window.innerHeight * y];
  const DIM = { x: 1050, y: 640 };
  const FPS = 60;
  const SAMPLES = 8;


  const params = {
    bpm: 100,
    step: 0,
    samples: [],
    muted: false,
  };


  function sketch(p5) {
    p5.setup = () => {
      p5.frameRate(FPS);
      p5.createCanvas(window.innerWidth, window.innerHeight);
      bass.setType('sine');
      bass.amp(0.5);

      for (let i = 0; i < SAMPLES; i++) {
        params.samples.push({
          freq: 300,
          on: false,
          bgOn: [199, 185, 110],
          bgOff: [149, 134, 58],
          x: i * (DIM.x / SAMPLES) + DIM.x / SAMPLES / 4,
          y: DIM.y - DIM.y * .25,
          w: DIM.x / SAMPLES / 2,
          h: DIM.y * .2
        });
      }
      console.log(params.samples);
    }
    p5.draw = () => {
      p5.background(255);
      p5.fill(40, 40, 50);
      p5.rect(0, 0, DIM.x, DIM.y);
      p5.stroke(255);
      p5.line(0, DIM.y * .2, DIM.x, DIM.y * .2);
      p5.line(0, DIM.y * .7, DIM.x, DIM.y * .7);

      if (Math.floor(p5.frameCount % (FPS * 60 / params.bpm / SAMPLES)) === 0) {
        params.step = (params.step + 1) % SAMPLES;
      }

      //params.muted ? bass.stop() : bass.start();

      params.samples.forEach((e, i) => {
        p5.noStroke();
        if (i === params.step) {
          bass.stop();
          bass.start();
          p5.fill.apply(p5, e.bgOn);
          bass.amp(.2);
          bass.freq(e.freq);
        } else {
          p5.fill.apply(p5, e.bgOff);
        }
        p5.rect(e.x, e.y, e.w, e.h);
      });
    }
  }

  function canvas(p5) {
    p5.background(255);
    p5.fill(40, 40, 50);
    p5.rect(0, 0, DIM.x, DIM.y);
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