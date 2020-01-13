export default function Sample(p5, { sample, x, y, w, h, bgOn = [199, 185, 110], selected }) {
  const bgOff = [149, 134, 58];
  const bgSelectedOn = [0, 0, 0];
  const bgSelectedOff = [255, 255, 255];

  this.selected = selected;
  this.on = false;

  return {
    render(step) {
      if (step) {
        p5.fill.apply(p5, this.selected ? bgSelectedOn : bgOn);
        if (this.on) {
          sample.start();
        }
      } else {
        sample.stop();
        p5.fill.apply(p5, this.selected ? bgSelectedOff : bgOff);
      }
      p5.rect(x, y, w, h);
    },
    select() {
      if (p5.mouseX >= x && p5.mouseX <= x + w && p5.mouseY >= y && p5.mouseY <= y + h) {
        this.selected = !this.selected;
      }
    }
  };

}