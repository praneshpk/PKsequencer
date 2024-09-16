export default function Button(
  ctx,
  func,
  {
    x,
    y,
    wF = 1,
    hF = 1,
    label,
    selected = false,
    bgOn = [199, 185, 110],
    bgOff = [200],
    inst = false,
  }
) {
  const bgOnSync = [255, 185, 110];

  return {
    inst,
    w: 50 * wF,
    h: 25 * hF,
    selected,
    exec: func,
    render(sync) {
      // Fill the rectangle based on conditions
      if (this.inst) {
        ctx.fillStyle = `rgb(${bgOff.join(",")})`; // If selected, bgOff else bgOn
      } else if (selected) {
        ctx.fillStyle = sync
          ? `rgb(${bgOnSync.join(",")})`
          : `rgb(${bgOn.join(",")})`;
      } else {
        ctx.fillStyle = `rgb(${bgOff.join(",")})`;
      }
      ctx.fillRect(x, y, this.w, this.h);

      if (typeof label === "string" || label instanceof String) {
        ctx.fillStyle = "white"; // Equivalent to fill(255)
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(label, x + this.w / 2, y - 16);
      } else {
        const img = new Image();
        img.src = label; // Provide image source if `label` is an image URL or object
        img.onload = function () {
          const imgWidth = 12; // Resize equivalent
          const imgHeight = (img.height / img.width) * imgWidth; // Keep aspect ratio
          ctx.drawImage(
            img,
            x + this.w / 2 - imgWidth / 2,
            y - 16 - imgHeight / 2,
            imgWidth,
            imgHeight
          );
        };
      }
    },
    select() {
      if (
        ctx.mouseX >= x &&
        ctx.mouseX <= x + this.w &&
        ctx.mouseY >= y &&
        ctx.mouseY <= y + this.h
      ) {
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
