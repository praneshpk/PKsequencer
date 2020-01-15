export default function Encoder(p5, func, {
  x, y, r = 50, label = '', val = 0,
}) {
  return {
    r,
    selected: false,
    pos: {},
    val,
    label,
    exec: func,
    render() {
      p5.arc(x, y, r, r, p5.PI, p5.PI + (p5.TWO_PI * this.val));

      p5.stroke(255);
      p5.noFill();
      p5.circle(x, y, r);
      p5.noStroke();
      p5.fill(255);
      p5.textAlign(p5.CENTER);
      p5.text(this.label, x - 2, y + r);
    },
    select() {
      const d = p5.dist(p5.mouseX, p5.mouseY, x, y);
      if (d < r / 2) {
        this.pos = { x: p5.mouseX, y: p5.mouseY };
        this.selected = true;
      }
    },
    adjust(dy) {
      if (this.selected) {
        this.exec(dy);
      }
    },
    reset() {
      this.selected = false;
      this.pos = {};
    },
  };
}
