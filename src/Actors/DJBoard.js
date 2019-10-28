import * as Mechamarkers from '../Mechamarkers';
import * as R from 'ramda';
import Vec2 from '../Utils/Vec2';

const VW = window.innerWidth;
const VH = window.innerHeight;
const TWO_PI = Math.PI * 2;
const DISC_SIZE = 40;

class DJBoard {
  constructor(position, side, spawnDancer) {
    this.position = position;
    this.height = VH;
    this.width = VW / 5;
    const slotX = this.width / 2 + position.x;
    this.slotPositions = [
      new Vec2(slotX, this.height / 4 + position.y),
      new Vec2(slotX, this.height / 2 + position.y),
      new Vec2(slotX, this.height * 3 / 4 + position.y),
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
      if (disc.position.dist2(pos) < 20) {
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
          const lx = (Math.random() * (VW / 2 - (VW / 5)) - 10) + VW / 5 + 10;
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
    ctx.translate(this.position.x, this.position.y);
    ctx.rect(0, 0, this.width, this.height);
    ctx.stroke();
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
