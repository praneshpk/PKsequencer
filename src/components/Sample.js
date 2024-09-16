export default function Sample(ctx, {
  sample, x, y, w, h, bgOn = [199, 185, 110], focused, seqLen,
}) {
  const bgOff = [149, 134, 58];
  const bgSelectedOn = [0, 0, 0];
  const bgSelectedOff = [255, 255, 255];

  return {
    focused,
    sample,
    isDragged: false,
    isClicked: false,
    selected: false,
    on: false,
    pattern: Array(seqLen).fill(false),
    temp: false,
    render(step, i) {
      ctx.noStroke();
      if (step) {
        ctx.fill(...this.selected ? bgSelectedOn : bgOn);
      } else {
        ctx.fill(...this.selected ? bgSelectedOff : bgOff);
      }
      ctx.rect(x, y, w, h);
      if (this.pattern[i] && !this.on) {
        this.sample.start();
        this.on = true;
      }

      if (this.focused) {
        ctx.fill(100);
        ctx.circle(x + w / 2, y + h + 15, 10, 10);
      }
    },
    select() {
      if (ctx.mouseX >= x && ctx.mouseX <= x + w && ctx.mouseY >= y && ctx.mouseY <= y + h) {
        this.selected = !this.selected;
        return true;
      }
      return false;
    },
    drag() {
      if (!this.isClicked) {
        if (ctx.mouseX >= x && ctx.mouseX <= x + w && ctx.mouseY >= y && ctx.mouseY <= y + h) {
          // this.selected = !this.selected;
          this.isDragged = true;
        } else if (this.isDragged) {
          this.selected = !this.selected;
          this.isDragged = false;
        }
      }
      return this.selected;
    },
  };
}
