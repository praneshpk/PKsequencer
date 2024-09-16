/* eslint-disable no-shadow */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import initMachine from './initMachine';
import Button from './Button';

export default function Machine() {

  const canvasRef = useRef(null)
  const context = useRef()
  

  const [DIM, setDIM] = useState({ x: window.innerWidth, y: window.innerHeight });
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
      url: '/pksequencer/img/metronome.png',
    },
  };

  const resizeHandler = useCallback(() => {
    if(canvasRef.current) {
      setDIM({x: canvasRef.current.width, y: canvasRef.current.height})
    }
  }, [setDIM])
 

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

  const setupCanvas = useCallback((ctx) => {
    // ctx.background(255);
    ctx.fillStyle = "rgb(40 40 50)";
    ctx.fillRect(0, 0, DIM.x, DIM.y);

    ctx.beginPath();
    ctx.moveTo(0, DIM.y * 0.2)
    ctx.lineTo(DIM.x, DIM.y * 0.2)
    ctx.strokeStyle = "white"
    ctx.stroke()

    ctx.beginPath();
    ctx.moveTo(0, DIM.y * 0.7)
    ctx.lineTo(DIM.x, DIM.y *  0.7)
    ctx.stroke()
    

    // ctx.line(0, DIM.y * 0.2, DIM.x, DIM.y * 0.2);
    // ctx.line(0, DIM.y * 0.7, DIM.x, DIM.y * 0.7);
  }, [DIM])

  const draw = useCallback((ctx) => {
    if (!Params.paused
      && Math.floor(ctx.frameCount % (FPS / (1 / 60) / Params.bpm.tic / 4)) === 0) {
      Clickables.samples.forEach((e) => {
        e.on = false;
      });
      Params.step = (Params.step + 1) % SAMPLES;
      if (Params.step % 4 === 0 && Params.metronome) {
        Assets.metronome.sound.start();
      }
    }
    // Clickables.samples.forEach((e, i) => {
    //   e.render(i === Params.step, Params.step);
    // });

    // Make metronome button light up to the beat (play / pause)
    Clickables.buttons.forEach((e, i) => {
      e.render(i === Assets.metronome.btn && Params.step % 4 === 0);
    });

    Clickables.encoders.forEach((e) => {
      e.render();
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    context.current = ctx

    Clickables.buttons.push(
      new Button(ctx, () => {
        Clickables.buttons.pop();
        initMachine(ctx, {
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
    setupCanvas(context.current)
    draw(context.current)
  }, [setupCanvas, draw])

  useEffect(() => {
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [resizeHandler])

  function sketch(ctx) {
    ctx.preload = () => {
      // Preload image Assets
      Object.keys(Assets).forEach((key) => {
        Assets[key].img = ctx.loadImage(Assets[key].url);
      });
    };
    ctx.mousePressed = () => {
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
    ctx.mouseDragged = (event) => {
      Clickables.encoders.forEach((e) => {
        e.adjust(-event.movementY * e.max * 0.01);
      });
      Clickables.samples.forEach((e, i) => {
        Clickables.samples[Params.focused].pattern[i] = e.drag();
      });
    };
    ctx.mouseWheel = (event) => {
      Clickables.encoders.forEach((e) => {
        e.select();
        e.adjust(event.delta * e.max * 0.01);
        e.reset();
      });
    };
    ctx.mouseReleased = () => {
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
    ctx.keyPressed = () => {
      if (ctx.keyCode === 32) {
        Params.paused = !Params.paused;
      } else if (ctx.keyCode === ctx.LEFT_ARROW) {
        focusSample(Params.focused > 0 ? Params.focused - 1 : SAMPLES - 1);
      } else if (ctx.keyCode === ctx.RIGHT_ARROW) {
        focusSample(Params.focused < SAMPLES - 1 ? Params.focused + 1 : 0);
      } else {
        [...qwerty].forEach((ch, i) => {
          if (String.fromCharCode(ctx.keyCode) === ch.toUpperCase()) {
            // Shortcut to select sample with SHIFT +
            if (ctx.keyIsDown(16)) {
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
    ctx.setup = () => {
      ctx.frameRate(FPS);
      ctx.createCanvas(window.innerWidth, window.innerHeight);
      Clickables.buttons.push(
        new Button(ctx, () => {
          Clickables.buttons.pop();
          initMachine(ctx, {
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
  }


  return (
    <div className="Machine">
      <canvas ref={canvasRef} width="2560" height="1440" style={{width:"100%", objectFit: "contain"}}/>
      <noscript>Please enable JavaScript to use this application</noscript>
    </div>
  );
}
