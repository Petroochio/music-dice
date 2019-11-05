import Vec2 from '../Utils/Vec2';

class Wall {
  constructor(p1, p2) {
    this.start = p1;
    this.end = p2;
    this.updateLength();
  }

  setStart(p) {
    this.start = p;
    this.updateLength();
  }

  setEnd(p) {
    this.end = p;
    this.updateLength();
  }

  updateLength() {
    this.axis = Vec2.sub(this.start, this.end);
    this.length = this.start.dist(this.end);
    this.lengthSq = this.start.dist2(this.end);
  }

  getReflection(p, fwd) {
    const circleVec = Vec2.sub(this.start, p);
    const proj = this.axis.dot(circleVec) / this.axis.mag();
    const closestPoint = this.axis.clone().normalize().scale(proj);
    const normal = Vec2.sub(circleVec, closestPoint).normalize();

    // reflection = fwd - 2(fwd . n)n
    return Vec2.sub(Vec2.scale(normal, 2 * fwd.dot(normal)), fwd);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.stroke();
  }
}

export default Wall;
