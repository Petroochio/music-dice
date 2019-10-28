import { drawDancer } from '../ImgManager';

const DANCER_SIZE = 30;

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
    ctx.save();
    const xOffset = this.flipped ? DANCER_SIZE / 2 : DANCER_SIZE / -2;
    ctx.translate(this.position.x + xOffset, this.position.y);
    ctx.scale(this.flipped ? -1 : 1, 1)
    drawDancer(ctx, this.asset, 0, 0, DANCER_SIZE);

    ctx.restore();
  }
}

export default Dancer;
