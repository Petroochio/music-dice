import Vec2 from '../Utils/Vec2';

class Ball {
  constructor(position, forward, radius) {
    this.position = position;
    this.forward = forward.normalize();
    this.r = radius;
    this.speed = 100;
  }

  setDirection(newFwd) {
    this.forward = Vec2.normalize(newFwd);
  }

  update(dt) {
    this.position.addScalar(this.forward, this.speed * dt);
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.translate(this.position.x, this.position.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export default Ball;
