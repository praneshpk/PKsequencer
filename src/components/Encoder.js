export default function Encoder(
  ctx,
  func,
  { x, y, r = 50, label = "", val = 0, min, max }
) {
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
      if (this.val > 0) {
        ctx.beginPath();
        ctx.arc(x, y, r, Math.PI, Math.PI + 2 * Math.PI * (val / max));
        ctx.strokeStyle = "white"; // Equivalent to stroke(255)
        ctx.stroke();
      }
      // Drawing the circle
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.stroke();

      // Drawing the label
      ctx.fillStyle = "white"; // Equivalent to fill(255)
      ctx.textAlign = "center";
      ctx.textBaseline = "top"; // Equivalent to textAlign(CENTER, TOP)
      ctx.fillText(label, x, y + r * 0.75);
    },
    select() {
      const d = ctx.dist(ctx.mouseX, ctx.mouseY, x, y);
      if (d < r / 2) {
        this.pos = { x: ctx.mouseX, y: ctx.mouseY };
        this.selected = true;
      }
    },
    adjust(dy) {
      if (this.selected) {
        this.val = Math.max(Math.min(this.max, this.val + dy), this.min);
        this.exec(this.val);
      }
    },
    reset() {
      this.selected = false;
      this.pos = {};
    },
  };
}
