import * as Mechamarkers from '../Mechamarkers';
import Vec2 from '../Utils/Vec2';
import Dice from './Dice';

class Player {
  constructor (dice1Markers, dice2Markers) {
    this.dice1 = new Dice(dice1Markers.map(id => Mechamarkers.getMarker(id)));
    this.dice2 = new Dice(dice2Markers.map(id => Mechamarkers.getMarker(id)));
    this.present = false;
  }

  getReflection(p, fwd) {
    if (!this.present) throw new Error('Cannont get reflection when player is not present');

    const axis = Vec2.sub(this.dice1.position, this.dice2.position);

    const circleVec = Vec2.sub(this.dice1.position, p);
    const proj = axis.dot(circleVec) / axis.mag();
    const closestPoint = axis.clone().normalize().scale(proj);
    const normal = Vec2.sub(circleVec, closestPoint).normalize();

    // reflection = fwd - 2(fwd . n)n
    return Vec2.sub(Vec2.scale(normal, 2 * fwd.dot(normal)), fwd);
  }

  checkCircleCollision(p, r) {
    if (this.present) {
      const rSq = r * r;
      const axis = Vec2.sub(this.dice1.position, this.dice2.position);
      const lengthSq = this.dice1.position.dist2(this.dice2.position);

      // Makes sure it's not off the end of the segment
      if (this.dice1.position.dist2(p) < rSq + lengthSq && this.dice2.position.dist2(p) < rSq + lengthSq) {
        // If the circle is close enough to the line to collide
        const circleVec = Vec2.sub(this.dice1.position, p);
        const proj = axis.dot(circleVec) / axis.mag();
        const closestPoint = axis.clone().normalize().scale(proj);

        if (closestPoint.dist2(circleVec) < rSq) return true;
      }
    }

    return false;
  }

  update(dt) {
    this.dice1.update(dt);
    this.dice2.update(dt);

    this.present = (this.dice1.present && this.dice2.present);
  }

  draw(ctx) {
    if (this.present) {
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(this.dice1.position.x, this.dice1.position.y);
      ctx.lineTo(this.dice2.position.x, this.dice2.position.y);
      ctx.stroke();
    }
  }
}

export default Player;
