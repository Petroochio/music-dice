import { drawDancer } from '../ImgManager';

const DANCER_SIZE = 80;

class Dancer {
  constructor(position, assetID) {
    this.position = position;
    this.asset = assetID;
    this.flipped = false;
  }

  flip() {
    this.flipped = !this.flipped;
  }

  draw(ctx) {
    let size = DANCER_SIZE;
    if (this.asset === 2) {
      size *= 1.3;
    } else if (this.asset === 3) {
      size *= 0.8
    } else if (this.assetID === 1) {
      size = DANCER_SIZE * 2;
    }
    size += 90 * this.position.y / window.innerWidth;
    ctx.save();
    const xOffset = this.flipped ? size / 2 : size / -2;
    ctx.translate(this.position.x + xOffset, this.position.y);
    ctx.scale(this.flipped ? -1 : 1, 1);
    drawDancer(ctx, this.asset, 0, 0, size);

    ctx.restore();
  }
}

export default Dancer;
