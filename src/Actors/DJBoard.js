import * as Mechamarkers from '../Mechamarkers';
import * as R from 'ramda';
import Vec2 from '../Utils/Vec2';

const VW = window.innerWidth;
const VH = window.innerHeight;
const TWO_PI = Math.PI * 2;
const DISC_SIZE = 65;

class DJBoard {
  constructor(position, side, spawnDancer) {
    this.position = position;
    this.height = VH;
    this.width = VW / 5;
    this.points = [
      new Vec2(0, VH - (VH / 5 * 2.2)),
      new Vec2(VW / 6, VH - (VH / 3.5)),
      new Vec2(VW / 6 * 2, VH - (VH / 3.5)),
      new Vec2(VW / 6 * 3, VH),
      new Vec2(VW / 6 * 4, VH - (VH / 3.5)),
      new Vec2(VW / 6 * 5, VH - (VH / 3.5)),
      new Vec2(VW, VH - (VH / 5 * 2.2)),
    ];
    const slotX = this.width / 2 + position.x;
    this.slotPositions = [
      new Vec2(VW / 6 * 0.4, VH - (VH / 6)),
      new Vec2(VW / 6 * 1.6, VH - (VH / 6)),
      new Vec2(VW / 6 * 4.4, VH - (VH / 6)),
      new Vec2(VW / 6 * 5.6, VH - (VH / 6)),
    ];
    this.slots = ['', '', ''];
    this.score = 0;
    this.side = side;
    this.spawnDancer = spawnDancer;
  }

  clearSlots() {
    this.slots[0] = '';
    this.slots[1] = '';
    this.slots[2] = '';
  }

  checkDiscSlotted(disc) {
    let isSlotted = false;
    this.slotPositions.forEach((pos, i) => {
      if (disc.position.dist2(pos) < 80) {
        isSlotted = true;
        this.slots[i] = disc.component;
      }
    });

    return isSlotted;
  }

  addScore(amount) {
    this.score += amount;
    for (let i = 0; i < amount; i++) {
      switch (this.side) {
        case 'LEFT':
          const lx = (Math.random() * (VW / 2 - (VW / 5)) - 60) + VW / 5 + 35;
          const ly = (VH - 60) * Math.random() + 30;
          this.spawnDancer(lx, ly);
          break;
        case 'RIGHT':
          const dx = (this.position.x - 10) - (Math.random() * (VW / 2 - (VW / 5))) + 10;
          const dy = (VH - 60) * Math.random() + 30;
          this.spawnDancer(dx, dy);
          break;
        default: break;
      }
    }
  }

  checkGoal(goal) {
    return R.all(R.contains(R.__, this.slots), goal);
  }

  update(dt, discs) {

  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(VW * 2, VH * 2);
    ctx.lineTo(-400, VH * 2);
    ctx.stroke();
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = 'white';
    this.slotPositions.forEach(slot => {
      ctx.beginPath();
      ctx.arc(slot.x, slot.y, DISC_SIZE, 0, TWO_PI);
      ctx.stroke();
    });
  }
}

export default DJBoard;
