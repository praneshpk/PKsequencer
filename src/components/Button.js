export default function Button(p5, func, {
  x, y, label, selected = false,
}) {
  const bgOn = [199, 185, 110];
  const bgOnSync = [255, 185, 110];
  const bgOff = [200];

  return {
    w: 50,
    h: 25,
    selected,
    exec: func,
    render(sync) {
      if (this.selected) {
        p5.fill(...sync ? bgOnSync : bgOn);
      } else {
        p5.fill(...bgOff);
      }
      p5.rect(x, y, this.w, this.h);
      p5.noStroke();
      if (typeof label === 'string' || label instanceof String) {
        p5.fill(255);
        p5.text(label, x + this.w / 2.5, y - 5);
      } else {
        label.resize(12, 0);
        // p5.smooth(4);
        p5.image(label, x + this.w / 3, y - 25);
      }
    },
    select() {
      if (p5.mouseX >= x && p5.mouseX <= x + this.w && p5.mouseY >= y && p5.mouseY <= y + this.h) {
        this.selected = !this.selected;
        this.exec();
      }
    },
  };
}
