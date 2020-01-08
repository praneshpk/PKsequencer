import React, { useEffect } from 'react';
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';

/* eslint-disable no-undef */
export default function Machine() {
  const bass = new p5.Oscillator();

  function sketch(p5) {
    p5.setup = () => {
      p5.createCanvas(window.innerWidth, window.innerHeight);
    }
    p5.draw = () => {
      p5.background(0);

    }
  }

  useEffect(() => {
    new p5(sketch);
  });

  return (
    <div className="Machine">

    </div>
  );
}