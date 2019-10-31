import { drawLight } from '../ImgManager';

class Light {
  constructor(position, rotation) {
    this.position = position;
    this.rotation = rotation;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    drawLight(ctx, 0, 0, 0);
    ctx.restore();
  }
}

export default Light;