class Trash {
  constructor(position) {
    this.position = position;
    this.radius = 40;
  }

  circleInRange(circle) {
    return this.position.dist(circle.position) < this.radius + circle.radius;
  }

  update(dt) {

  }

  draw(ctx) {
    ctx.save();

    ctx.fillStyle = 'white';
    ctx.translate(this.position.x, this.position.y);
    ctx.beginPath();
    ctx.fillRect(-(this.radius) / 2, -(this.radius) / 2, this.radius, this.radius);

    ctx.restore();
  }
}

export default Trash;
