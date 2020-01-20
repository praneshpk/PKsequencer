export default function Button(p5, func, {
  x, y, wF = 1, hF = 1, label, selected = false,
  bgOn = [199, 185, 110], bgOff = [200], inst = false,
}) {
  const bgOnSync = [255, 185, 110];

  return {
    inst,
    w: 50 * wF,
    h: 25 * hF,
    selected,
    exec: func,
    render(sync) {
      if (this.inst) {
        p5.fill(...this.selected ? bgOff : bgOn);
      } else if (this.selected) {
        p5.fill(...sync ? bgOnSync : bgOn);
      } else {
        p5.fill(...bgOff);
      }
      p5.noStroke();
      p5.rect(x, y, this.w, this.h);
      p5.noStroke();
      if (typeof label === 'string' || label instanceof String) {
        p5.fill(255);
        p5.textAlign(p5.CENTER, p5.TOP);
        p5.text(label, x + this.w / 2, y - 16);
      } else {
        label.resize(12, 0);
        p5.imageMode(p5.CENTER);
        p5.image(label, x + this.w / 2, y - 16);
      }
    },
    select() {
      if (p5.mouseX >= x && p5.mouseX <= x + this.w && p5.mouseY >= y && p5.mouseY <= y + this.h) {
        this.selected = !this.selected;
        if (!this.inst) {
          this.exec();
        }
        return true;
      }
      return false;
    },
  };
}
