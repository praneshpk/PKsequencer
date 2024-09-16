import Sample from './Sample';
import Button from './Button';
import Encoder from './Encoder';

export default function initMachine(ctx, {
  Clickables, Assets, Params, focusSample, DIM, SAMPLES,
}) {
  // eslint-disable-next-line global-require
  const AudioUnit = require('./AudioUnit.js').default;

  Assets.metronome.sound = new AudioUnit({ freq: 2000, amp: 0.15 });
  let AU;
  if (Params.voices < SAMPLES) {
    AU = Array(Params.voices).fill(new AudioUnit({ freq: 100 }));
  }
  // Create samples
  for (let i = 0; i < SAMPLES; i++) {
    Clickables.samples.push(
      new Sample(ctx, {
        sample: AU ? AU[i % Params.voices] : new AudioUnit({ freq: (i + 1) * 100 }),
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
  // Button style preset
  function buttonPreset(w = Clickables.buttons[0].w,
    start = [DIM.x * 0.25, DIM.y - DIM.y * 0.35]) {
    return {
      x: start[0] + (w + 10) * Clickables.buttons.length,
      y: start[1],
      wF: DIM.x * 0.0015,
      hF: DIM.y * 0.0012,
    };
  }

  // Left sample
  Clickables.buttons.push(
    new Button(ctx, () => {
      focusSample(Params.focused > 0 ? Params.focused - 1 : SAMPLES - 1);
    }, {
      ...buttonPreset(0),
      label: '<',
      inst: true,
      bgOn: [100],
    }),
  );
  // Right sample
  Clickables.buttons.push(
    new Button(ctx, () => {
      focusSample(Params.focused < SAMPLES - 1 ? Params.focused + 1 : 0);
    }, {
      ...buttonPreset(),
      label: '>',
      inst: true,
      bgOn: [100],
    }),
  );

  // Metronome
  Clickables.buttons.push(
    new Button(ctx, () => {
      Params.metronome = !Params.metronome;
    }, {
      ...buttonPreset(),
      label: Assets.metronome.img,
    }),
  );
  Assets.metronome.btn = Clickables.buttons.length - 1;

  // Play / pause
  Clickables.buttons.push(
    new Button(ctx, () => { Params.paused = !Params.paused; }, {
      ...buttonPreset(),
      label: '▶',
      selected: true,
    }),
  );

  // Record
  Clickables.buttons.push(
    new Button(ctx, () => { Params.recording = !Params.recording; }, {
      ...buttonPreset(),
      label: '●',
      bgOff: [255, 130, 130],
      bgOn: [255, 60, 0],
    }),
  );
  // Clear part
  Clickables.buttons.push(
    new Button(ctx, () => {
      Clickables.samples[Params.focused].pattern.fill(false);
      focusSample(Params.focused);
    }, {
      ...buttonPreset(),
      label: 'CLEAR PTN',
      inst: true,
      bgOn: [100, 100, 200],
    }),
  );
  // Clear pattern
  Clickables.buttons.push(
    new Button(ctx, () => {
      // TODO: Replace with custom dialog
      if (window.confirm('Are you sure you would like to clear the current pattern? This action cannot be undone')) {
        Clickables.samples.forEach((e) => { e.pattern.fill(false); });
        focusSample(Params.focused);
      }
    }, {
      ...buttonPreset(),
      label: 'CLEAR SEQ',
      inst: true,
      bgOn: [200, 100, 200],
    }),
  );

  /* Encoders */

  // BPM
  const bpmEncoder = new Encoder(ctx, null, {
    label: Params.bpm.tic,
    x: DIM.x - 50,
    y: 50,
    min: Params.bpm.min,
    max: Params.bpm.max,
    val: Params.bpm.tic,
  });
  bpmEncoder.exec = (val) => {
    Params.bpm.tic = val;
    bpmEncoder.label = Params.bpm.tic;
  };
  // Makes sure metronome does not change on bank change
  Assets.metronome.enc = Clickables.encoders.length;
  Clickables.encoders.push(bpmEncoder);

  // Encoder style preset
  function encoderPreset(r = Clickables.encoders[1].r,
    start = [DIM.x / 3, DIM.y * 0.3]) {
    return {
      x: start[0] + (r + 50) * Clickables.encoders.length,
      y: start[1],
      r,
    };
  }
  // Amplification
  Clickables.encoders.push(
    new Encoder(ctx, (val) => {
      Clickables.samples[Params.focused].sample.amp = val;
      console.log(`Amplitude on Sample ${Params.focused}: ${val}`);
    }, {
      ...encoderPreset(50),
      label: 'AMP',
      min: 0.01,
      max: 1,
      val: 0.5,
    }),
  );
  // Frequency
  Clickables.encoders.push(
    new Encoder(ctx, (val) => {
      Clickables.samples[Params.focused].sample.freq = val;
      console.log(`Frequency on Sample ${Params.focused}: ${val}Hz`);
    }, {
      ...encoderPreset(),
      label: 'FREQ',
      min: 20,
      max: 1600,
      val: 100,
    }),
  );
  // Attack
  Clickables.encoders.push(
    new Encoder(ctx, (val) => {
      Clickables.samples[Params.focused].sample.attack = val;
      console.log(`Attack on Sample ${Params.focused}: ${val * 1000}ms`);
    }, {
      ...encoderPreset(),
      label: 'ATTACK',
      min: 0,
      max: 5,
      val: 0,
    }),
  );
  // Decay
  Clickables.encoders.push(
    new Encoder(ctx, (val) => {
      Clickables.samples[Params.focused].sample.decay = val;
      console.log(`Decay on Sample ${Params.focused}: ${val * 1000}ms`);
    }, {
      ...encoderPreset(),
      label: 'DECAY',
      min: 0,
      max: 2,
      val: 0.2,
    }),
  );
  // Sustain
  Clickables.encoders.push(
    new Encoder(ctx, (val) => {
      Clickables.samples[Params.focused].sample.sustain = val;
      console.log(`Sustain on Sample ${Params.focused}: ${val * 1000}ms`);
    }, {
      ...encoderPreset(),
      label: 'SUSTAIN',
      min: 0,
      max: 1,
      val: 0.05,
    }),
  );
  // Release
  Clickables.encoders.push(
    new Encoder(ctx, (val) => {
      Clickables.samples[Params.focused].sample.release = val;
      console.log(`Release on Sample ${Params.focused}: ${val * 1000}ms`);
    }, {
      ...encoderPreset(),
      label: 'RELEASE',
      min: 0,
      max: 10,
      val: 1,
    }),
  );
}
