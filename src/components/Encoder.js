export default function Encoder(p5, func, {
  x, y, r = 40, label = '', val = 0, min, max,
}) {
  return {
    r,
    selected: false,
    pos: {},
    val,
    min,
    max,
    label,
    exec: func,
    render() {
      p5.arc(x, y, r, r, p5.PI, p5.PI + (p5.TWO_PI * (this.val / this.max)));
      p5.stroke(255);
      p5.noFill();
      p5.circle(x, y, r);
      p5.noStroke();
      p5.fill(255);
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.text(this.label, x - 2, y + r * 0.75);
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
        this.val = Math.max(
          Math.min(this.max, this.val + dy),
          this.min,
        );
        this.exec(this.val);
      }
    },
    reset() {
      this.selected = false;
      this.pos = {};
    },
  };
}
