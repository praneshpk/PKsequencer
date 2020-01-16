import p5 from 'p5';
import 'p5/lib/addons/p5.sound';

export default function AudioUnit({
  type = 'sine', a = 0, d = 200, s = 50, r = 1000, freq = 250, amp = 0.5,
}) {
  return {
    osc: new p5.Oscillator(),
    env: new p5.Envelope(),
    attack: a / 1000,
    decay: d / 1000,
    sustain: s / 1000,
    release: r / 1000,
    freq,
    amp,
    type,
    playing: false,

    start() {
      this.playing = true;

      this.env.setADSR(this.attack, this.decay, this.sustain, this.release);
      this.env.setRange(this.amp, this.amp);
      this.env.play();

      this.osc.setType(this.type);
      this.osc.freq(this.freq);
      this.osc.amp(this.env);
      this.osc.start();
      // audio.amp(this.amp, this.a);
      this.osc.stop(this.sustain);
    },
  };
}
