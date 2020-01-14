export default function Encoder(p5, func, {
  x = 50, y = 50, r = 50, label = '', val = 0,
}) {
  return {
    r,
    selected: false,
    pos: {},
    val,
    label,
    exec: func,
    render() {
      p5.stroke(255);
      p5.noFill();
      p5.circle(x, y, r);
      p5.noStroke();
      p5.fill(255);
      p5.text(this.label, x - r * 0.25, y + r);
    },
    select() {
      const d = p5.dist(p5.mouseX, p5.mouseY, x, y);
      if (d < r / 2) {
        this.pos = { x: p5.mouseX, y: p5.mouseY };
        this.selected = true;
      }
    },
    adjust() {
      if (this.selected) {
        this.exec(this.pos.y - p5.mouseY);
      }
    },
    reset() {
      this.selected = false;
      this.pos = {};
    },
  };
}
