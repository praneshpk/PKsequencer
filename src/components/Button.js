export default function Button(p5, func, { x, y }) {
  const r = 25;
  const bgOn = [130];
  const bgOff = [20];

  this.selected = false;

  return {
    exec: func,
    render() {
      if (this.selected) {
        p5.fill.apply(p5, bgOn);
      } else {
        p5.fill.apply(p5, bgOff);
      }
      p5.circle(x, y, r, r);
    },
    select() {
      let d = p5.dist(p5.mouseX, p5.mouseY, x, y);
      if (d < r / 2) {
        this.selected = !this.selected;
        this.exec();
      }
    }
  }
}