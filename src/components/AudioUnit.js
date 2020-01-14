import p5 from 'p5';
import 'p5/lib/addons/p5.sound';

export default function AudioUnit({
  type = 'sine', a = 0, d = 200, s = 50, r = 1000, freq = 250, amp = 0.5,
}) {
  return {
    osc: new p5.Oscillator(),
    env: new p5.Envelope(),
    a: a / 1000,
    d: d / 1000,
    s: s / 1000,
    r: r / 1000,
    freq,
    amp,
    type,
    playing: false,
    start() {
      this.playing = true;

      this.env.setADSR(this.a, this.d, this.s, this.r);
      this.env.setRange(this.amp, this.amp);
      this.env.play();

      this.osc.setType(this.type);
      this.osc.freq(this.freq);
      this.osc.amp(this.env);
      this.osc.start();
      // audio.amp(this.amp, this.a);
      this.osc.stop(this.s);
    },
  };
}
