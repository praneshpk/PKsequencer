export default function AudioUnit(audio, { type = 'sine', a = 0, d = 200, s = 50, r = 1000, freq = 250, amp = .5 }) {
  return {
    a: a / 1000,
    d: d / 1000,
    s: s / 1000,
    r: r / 1000,
    freq,
    amp,
    type,
    playing: false,
    start() {
      //if (!this.playing) {
      this.playing = true;
      audio.setType(this.type);
      audio.freq(this.freq);
      audio.amp(0);
      audio.start();
      audio.amp(this.amp, this.a);
      audio.stop(this.s);
      //}
    },
    stop() {
      this.playing = false;
    }
  }
}