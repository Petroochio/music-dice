import Vec2 from '../Utils/Vec2';
import * as Mechamarkers from '../Mechamarkers';
import Dice from './Dice';

class DiceWall {
  constructor() {
    this.dice1 = new Dice(new Vec2(600, 20), [51, 52, 56, 57, 58, 59]);
    this.dice2 = new Dice(new Vec2(600, 2000), [53, 54, 44, 47, 48, 49]);

    this.canCapture = false;
    this.broken = false;
    this.wasDice1Present = false;
    this.wasDice2Present = false;
  }

  update(dt) {
    this.dice1.update(dt);
    this.dice2.update(dt);

    this.canCapture = (this.dice1.present && this.dice2.present && !this.broken);
    if (this.broken) {
      this.broken = !(!this.wasDice1Present || !this.wasDice2Present);
    }

    this.wasDice1Present = this.dice1.present;
    this.wasDice2Present = this.dice2.present;
  }

  break() {
    this.broken = true;
  }

  draw(ctx) {
    if (this.canCapture) {
      ctx.save();

      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(this.dice1.position.x, this.dice1.position.y);
      ctx.lineTo(this.dice2.position.x, this.dice2.position.y);
      ctx.stroke();

      ctx.restore();
    }
  }

  checkCircleCollision(p, r) {
    const rSq = r * r;
    const start = this.dice1.position;
    const end = this.dice2.position;
    const axis = Vec2.sub(start, end);
    const lengthSq = start.dist2(end);

    // Makes sure it's not off the end of the segment
    if (start.dist2(p) < rSq + lengthSq && end.dist2(p) < rSq + lengthSq) {
      // If the circle is close enough to the line to collide
      const circleVec = Vec2.sub(start, p);
      const proj = axis.dot(circleVec) / axis.mag();
      const closestPoint = axis.clone().normalize().scale(proj);

      if (closestPoint.dist2(circleVec) < rSq) return true;
    }

    // Otherwise no
    return false;
  }
}

export default DiceWall;
