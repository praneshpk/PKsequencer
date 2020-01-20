import React from 'react';
import Machine from './Machine';
import './App.scss';

export default function App() {
  // function canvas(p5) {
  //   p5.background(255);
  //   p5.fill(40, 40, 50);
  //   p5.rect(0, 0, D[0], D[1]);
  //   p5.stroke(255);
  //   p5.line(0, D[1] * .2, D[0], D[1] * .2);
  //   p5.line(0, D[1] * .7, D[0], D[1] * .7);

  //   if (!paused && Math.floor(p5.frameCount % (FPS * 60 / BPM / (SAMPLES))) === 0) {
  //     step = (step + 1) % SAMPLES;
  //   }
  //   contexts.forEach((e, i) => sample(i === step, bass, e));
  // }


  return (
    <div className="App">
      <Machine />
    </div>
  );
}
