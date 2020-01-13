export default function AudioUnit(audio, { t = 'sine', a = 0, d = 200, s = 50, r = 1000, freq = 250, amp = .5 }) {
  // ADSR -- all in ms
  this.a = a / 1000;
  this.d = d / 1000;
  this.s = s / 1000;
  this.r = r / 1000;
  this.freq = freq;
  this.amp = amp;
  this.type = t;

  this.playing = false;

  return {
    start() {
      if (!this.playing) {
        this.playing = true;
        audio.setType(this.type);
        audio.freq(this.freq);
        audio.amp(0);
        audio.start();
        audio.amp(this.amp, this.a);
        audio.stop(this.s);
      }
    },
    stop() {
      this.playing = false;
    }
  }
}