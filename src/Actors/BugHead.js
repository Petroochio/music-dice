import Vec2 from '../Utils/Vec2';
import Bugsegment from './BugSegment';
import { highlightTrack, balanceTrack } from '../TrackManager';
// on pass beat check if beat was clicked and reset it
import Explosion from './Explosion';

const headImg = {
  green: [new Image(), new Image(), new Image()],
  yellow: [new Image(), new Image(), new Image()],
  red: [new Image(), new Image(), new Image()],
  blue: [new Image(), new Image(), new Image()],
};
headImg.green[0].src = './assets/centipede/blue/tri/Head_1.png';
headImg.green[1].src = './assets/centipede/blue/tri/Head_2.png';
headImg.green[2].src = './assets/centipede/blue/tri/Head_3.png';
headImg.yellow[0].src = './assets/centipede/yellow/Bug_Head_1F.png';
headImg.yellow[1].src = './assets/centipede/yellow/Bug_Head_2F.png';
headImg.yellow[2].src = './assets/centipede/yellow/Bug_Head_3F.png';
headImg.red[0].src = './assets/centipede/red/Bug_Head_1E.png';
headImg.red[1].src = './assets/centipede/red/Bug_Head_2E.png';
headImg.red[2].src = './assets/centipede/red/Bug_Head_3E.png';
headImg.blue[0].src = './assets/centipede/blue/Bug_Head_1G.png';
headImg.blue[1].src = './assets/centipede/blue/Bug_Head_2G.png';
headImg.blue[2].src = './assets/centipede/blue/Bug_Head_3G.png';

class BugHead {
  constructor(startPosition) {
    this.position = startPosition;
    this.forward = Vec2.sub(this.position, new Vec2(window.innerWidth / 2, window.innerHeight / 2))
      .normalize(); // should be a unit vector
    this.speed = 75;
    this.radius = 30;
    this.nextSegment = new Bugsegment(this, 7, this.radius + 10);
    this.isCaught = false;
    this.beatInfo = false;
    this.wasBeatClicked = false;
    this.breakFreeCount = 0;
    this.BREAK_MAX = 3;
    this.rageTime = 0;
    this.frame = 0;
    this.explosion = new Explosion();
  }

  update(dt) {
    let moveVec
    if (!this.isCaught) {
      // move and keep in bounds
      moveVec = this.rageTime > 0 ? this.forward.clone().scale(this.speed * dt * 2) : this.forward.clone().scale(this.speed * dt);
      let newPosition = Vec2.add(this.position, moveVec);
      if (newPosition.x < 30) {
        this.forward.x += 0.03;
        this.forward.normalize();
      } else if (newPosition.x > window.innerWidth - 30) {
        this.forward.x -= 0.03;
        this.forward.normalize();
      } else if (newPosition.y > window.innerHeight - 30) {
        this.forward.y -= 0.03;
        this.forward.normalize();
      } else if (newPosition.y < 30) {
        this.forward.y += 0.03;
        this.forward.normalize();
      }
      moveVec = this.rageTime > 0 ? this.forward.clone().scale(this.speed * dt * 2) : this.forward.clone().scale(this.speed * dt);
      newPosition = Vec2.add(this.position, moveVec);
      this.position.copy(newPosition);
    }

    if (this.breakFreeCount >= this.BREAK_MAX) {
      this.startRage();
    }

    if (this.rageTime > 0) {
      this.rageTime -= dt;
      // this.forward.x += 0.03;
      // this.forward.normalize();

      if (this.rageTime <= 0) this.nextSegment.endRage();
    }

    this.nextSegment.update(dt);
  }

  checkRemainingBeats() {
    return this.beatInfo;
  }

  frameUpdate() {
    this.frame += 1;
    this.frame = this.frame % 3;
    this.explosion.frameUpdate();
    if (!this.isCaught) this.nextSegment.frameUpdate();
  }

  beatUpdate() {
    this.nextSegment.beatUpdate();
    this.explosion.frameUpdate();
  }

  completeBeat(pos) {
    this.isCaught = false;
    this.nextSegment.startRage();
    this.startRage();
  }

  startRage() {
    this.nextSegment.startRage();
    this.rageTime = 10 + 3 * Math.random();
    this.isCaught = false;
    this.breakFreeCount = 0;
    this.nextSegment.breakBeat();
    balanceTrack();
  }

  passBeat(newBeat) {
    if (this.beatInfo) {
      // drop beat, auto break free
      if (!this.wasBeatClicked) {
        this.breakFreeCount += 1;
      }
    }
    this.beatInfo = newBeat;
    this.wasBeatClicked = false;
  }

  clickBeat() {
    if (!this.beatInfo) {
      // this.breakFreeCount += 1;
    } else {
      this.wasBeatClicked = true;
    }
  }

  getCaught() {
    if (!this.isCaught && this.rageTime <= 0) {
      highlightTrack();
      this.isCaught = true;
      this.nextSegment.triggerBeat(0);
    }
  }

  draw(ctx) {
    this.nextSegment.draw(ctx);
    ctx.save();

    let img = this.beatInfo ? headImg.yellow[this.frame] : headImg.green[this.frame];
    if (this.wasBeatClicked) img = headImg.blue[this.frame];
    if (this.rageTime > 0) img = headImg.red[this.frame];
    const ratio = 140 / img.width;
    const w = img.width * ratio;
    const h = img.height * ratio;

    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.forward.angle() - Math.PI / 2);
    ctx.drawImage(img, -w / 2, -h / 2 + 15, w, h);

    ctx.restore();

    this.explosion.draw(ctx);
  }
}

export default BugHead;
