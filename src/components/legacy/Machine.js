/* eslint-disable no-shadow */
import React, { useEffect } from 'react';
import p5 from 'p5';

import initMachine from './initMachine';
import Button from './Button';

export default function Machine() {
  const DIM = { x: window.innerWidth, y: window.innerHeight };
  const FPS = 60;
  const SAMPLES = 16;
  const Params = {
    init: false,
    voices: 16,
    bpm: {
      min: 20,
      tic: 120,
      max: 250,
    },
    step: 0,
    muted: false,
    paused: false,
    recording: false,
    metronome: false,
    focused: 0,
  };
  const Clickables = {
    samples: [],
    buttons: [],
    encoders: [],
  };

  const Assets = {
    metronome: {
      url: 'img/metronome.png',
    },
  };

  window.addEventListener('resize', () => {
    DIM.x = window.innerWidth;
    DIM.y = window.innerHeight;
  });

  const qwerty = 'qwertyuiopasdfghjklzxcvbnm'.substring(0, SAMPLES);

  function focusSample(i) {
    // Remove focus from current sample
    Clickables.samples[Params.focused].focused = false;

    // Set focus sample to passed index
    Params.focused = i;
    Clickables.samples[Params.focused].focused = true;

    // Set current pattern to machine
    Clickables.samples[Params.focused].pattern.forEach((e, i) => {
      Clickables.samples[i].selected = e;
    });

    // Set encoders to correct settings
    Clickables.encoders.forEach((e, i) => {
      if (i !== Assets.metronome.enc) {
        e.val = Clickables.samples[Params.focused].sample[e.label.toLowerCase()];
      }
    });
  }

  function canvas(p5) {
    p5.background(255);
    p5.fill(40, 40, 50);
    p5.noStroke();
    p5.rect(0, 0, DIM.x, DIM.y);
    p5.strokeWeight(1);
    p5.stroke(255);
    p5.line(0, DIM.y * 0.2, DIM.x, DIM.y * 0.2);
    p5.line(0, DIM.y * 0.7, DIM.x, DIM.y * 0.7);
  }


  function sketch(p5) {
    p5.preload = () => {
      // Preload image Assets
      Object.keys(Assets).forEach((key) => {
        Assets[key].img = p5.loadImage(Assets[key].url);
      });
    };
    p5.mousePressed = () => {
      Object.keys(Clickables).forEach((key) => {
        Clickables[key].forEach((e, i) => {
          if (key === 'samples') {
            const inRegion = e.select();
            Clickables[key][Params.focused].pattern[i] = e.selected;
            e.isClicked = inRegion;
          } else {
            e.select();
          }
        });
      });
    };
    p5.mouseDragged = (event) => {
      Clickables.encoders.forEach((e) => {
        e.adjust(-event.movementY * e.max * 0.01);
      });
      Clickables.samples.forEach((e, i) => {
        Clickables.samples[Params.focused].pattern[i] = e.drag();
      });
    };
    p5.mouseWheel = (event) => {
      Clickables.encoders.forEach((e) => {
        e.select();
        e.adjust(event.delta * e.max * 0.01);
        e.reset();
      });
    };
    p5.mouseReleased = () => {
      Clickables.encoders.forEach((e) => {
        e.reset();
      });
      // for non-toggle buttons
      Clickables.buttons.forEach((e) => {
        if (e.inst) {
          if (e.select()) {
            e.exec();
          }
          e.selected = false;
        }
      });
      Clickables.samples.forEach((e) => {
        e.isClicked = false;
      });
    };
    p5.keyPressed = () => {
      if (p5.keyCode === 32) {
        Params.paused = !Params.paused;
      } else if (p5.keyCode === p5.LEFT_ARROW) {
        focusSample(Params.focused > 0 ? Params.focused - 1 : SAMPLES - 1);
      } else if (p5.keyCode === p5.RIGHT_ARROW) {
        focusSample(Params.focused < SAMPLES - 1 ? Params.focused + 1 : 0);
      } else {
        [...qwerty].forEach((ch, i) => {
          if (String.fromCharCode(p5.keyCode) === ch.toUpperCase()) {
            // Shortcut to select sample with SHIFT +
            if (p5.keyIsDown(16)) {
              focusSample(i);
            } else {
              Clickables.samples[i].sample.start();
              Clickables.samples[i].sample.playing = false;
              if (Params.recording) {
                Clickables.samples[i].pattern[Params.step] = true;
                if (i === Params.focused) {
                  focusSample(i);
                }
              }
            }
          }
        });
      }
    };
    p5.setup = () => {
      p5.frameRate(FPS);
      p5.createCanvas(window.innerWidth, window.innerHeight);
      Clickables.buttons.push(
        new Button(p5, () => {
          Clickables.buttons.pop();
          initMachine(p5, {
            Clickables, Assets, Params, focusSample, DIM, SAMPLES,
          });
        }, {
          x: DIM.x / 2.5,
          y: DIM.y / 2.5,
          wF: 5,
          hF: 5,
          label: 'START',
          inst: true,
          bgOn: [0, 255, 100],
        }),
      );
    };
    p5.draw = () => {
      canvas(p5);

      if (!Params.paused
        && Math.floor(p5.frameCount % (FPS / (1 / 60) / Params.bpm.tic / 4)) === 0) {
        Clickables.samples.forEach((e) => {
          e.on = false;
        });
        Params.step = (Params.step + 1) % SAMPLES;
        if (Params.step % 4 === 0 && Params.metronome) {
          Assets.metronome.sound.start();
        }
      }

      Clickables.samples.forEach((e, i) => {
        e.render(i === Params.step, Params.step);
      });

      // Make metronome button light up to the beat (play / pause)
      Clickables.buttons.forEach((e, i) => {
        e.render(i === Assets.metronome.btn && Params.step % 4 === 0);
      });

      Clickables.encoders.forEach((e) => {
        e.render();
      });
    };
  }

  useEffect(() => {
    // eslint-disable-next-line new-cap, no-new
    new p5(sketch);
  });

  return (
    <div className="Machine">
      <noscript>Please enable JavaScript to use this application</noscript>
    </div>
  );
}
