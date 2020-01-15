/* eslint-disable no-shadow */
import React, { useEffect } from 'react';
import p5 from 'p5';

import Sample from './Sample';
import AudioUnit from './AudioUnit';
import Button from './Button';
import Encoder from './Encoder';

export default function Machine() {
  const DIM = { x: window.innerWidth, y: window.innerHeight };
  const FPS = 60;
  const SAMPLES = 16;

  const Params = {
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

  window.addEventListener('resize', () => {
    DIM.x = window.innerWidth;
    DIM.y = window.innerHeight;
  });

  const qwerty = 'qwertyuiopasdfghjklzxcvbnm'.substring(0, SAMPLES);

  const assets = {
    metronome: {
      url: 'img/metronome.png',
      sound: new AudioUnit({ freq: 2000, amp: 0.15 }),
    },
  };
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
  }

  function sketch(p5) {
    p5.preload = () => {
      // Preload image assets
      Object.keys(assets).forEach((key) => {
        assets[key].img = p5.loadImage(assets[key].url);
      });
    };
    p5.mousePressed = () => {
      Object.keys(Clickables).forEach((key) => {
        Clickables[key].forEach((e, i) => {
          if (key === 'samples') {
            Clickables[key][Params.focused].pattern[i] = e.select();
          } else {
            e.select();
          }
        });
      });
    };
    p5.mouseDragged = (event) => {
      Clickables.encoders.forEach((e) => {
        e.adjust(-event.movementY);
      });
    };
    p5.mouseWheel = (event) => {
      Clickables.encoders.forEach((e) => {
        e.select();
        e.adjust(event.delta);
        e.reset();
      });
    };
    p5.mouseReleased = () => {
      Object.keys(Clickables).forEach((key) => {
        if (key === 'encoders') {
          Clickables[key].forEach((e) => {
            e.reset();
          });
        }
        // For non-toggle buttons
        if (key === 'buttons') {
          Clickables[key].forEach((e) => {
            if (e.inst) {
              e.selected = false;
              if (e.select()) {
                e.exec();
              }
            }
          });
        }
      });
    };
    p5.keyPressed = () => {
      if (p5.keyCode === p5.LEFT_ARROW) {
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

      // Create samples
      for (let i = 0; i < SAMPLES; i++) {
        Clickables.samples.push(
          new Sample(p5, {
            sample: new AudioUnit({ freq: (i + 1) * 100 }),
            seqLen: SAMPLES,
            x: i * (DIM.x / SAMPLES) + DIM.x / SAMPLES / 4,
            y: DIM.y * 0.75,
            w: DIM.x / SAMPLES / 2,
            h: DIM.y * 0.2,
            focused: i === Params.focused,
          }),
        );
      }

      /* Buttons */
      // Metronome
      Clickables.buttons.push(
        new Button(p5, () => {
          Params.metronome = !Params.metronome;
        }, {
          x: DIM.x / 2,
          y: DIM.y - DIM.y * 0.35,
          label: assets.metronome.img,
        }),
      );
      // Play / pause
      Clickables.buttons.push(
        new Button(p5, () => { Params.paused = !Params.paused; }, {
          x: DIM.x / 2 + (Clickables.buttons[0].w + 10) * Clickables.buttons.length,
          y: DIM.y - DIM.y * 0.35,
          label: '▶',
          selected: true,
        }),
      );
      // Record
      Clickables.buttons.push(
        new Button(p5, () => { Params.recording = !Params.recording; }, {
          x: DIM.x / 2 + (Clickables.buttons[0].w + 10) * Clickables.buttons.length,
          y: DIM.y - DIM.y * 0.35,
          label: '●',
          bgOff: [255, 130, 130],
          bgOn: [255, 60, 0],
        }),
      );
      // Clear
      const clear = new Button(p5, null, {
        x: DIM.x / 2 + (Clickables.buttons[0].w + 10) * Clickables.buttons.length,
        y: DIM.y - DIM.y * 0.35,
        label: 'CLEAR PTN',
        inst: true,
      });
      clear.exec = () => {
        // TODO: Replace with custom dialog
        if (window.confirm('Are you sure you would like to clear the current pattern? This action cannot be undone')) {
          Clickables.samples.forEach((e) => { e.pattern.fill(false); });
          focusSample(Params.focused);
        }
      };
      Clickables.buttons.push(clear);
      // BPM
      const bpmEncoder = new Encoder(p5, null, {
        label: Params.bpm.tic,
        val: Params.bpm.tic / Params.bpm.max,
        x: DIM.x - 50,
        y: 50,
        r: 50,
      });
      bpmEncoder.exec = (d) => {
        const oldBpm = Params.bpm.tic;
        Params.bpm.tic = Math.max(
          Math.min(Params.bpm.max, Params.bpm.tic + d),
          Params.bpm.min,
        );
        bpmEncoder.val += (Params.bpm.tic - oldBpm) / Params.bpm.max;
        bpmEncoder.label = Params.bpm.tic;
      };
      Clickables.encoders.push(bpmEncoder);
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
          assets.metronome.sound.start();
        }
      }

      Clickables.samples.forEach((e, i) => {
        e.render(i === Params.step, Params.step);
      });

      // Make first button light up to the metronome (play / pause)
      Clickables.buttons.forEach((e, i) => {
        e.render(i === 0 && Params.step % 4 === 0);
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
