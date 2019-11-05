import Vec2 from "../Utils/Vec2";
import Bugsegment from './BugSegment';
// on pass beat check if beat was clicked and reset it

const headImg = {
  green: [new Image(), new Image(), new Image()],
  yellow: [new Image(), new Image(), new Image()],
};
headImg.green[0].src = './assets/centipede/green/Bug_Head_1B.png';
headImg.green[1].src = './assets/centipede/green/Bug_Head_2B.png';
headImg.green[2].src = './assets/centipede/green/Bug_Head_3B.png';
headImg.yellow[0].src = './assets/centipede/yellow/Bug_Head_1F.png';
headImg.yellow[1].src = './assets/centipede/yellow/Bug_Head_2F.png';
headImg.yellow[2].src = './assets/centipede/yellow/Bug_Head_3F.png';

class BugHead {
  constructor(startPosition) {
    this.position = startPosition;
    this.forward = new Vec2(1, 0.5).normalize(); // should be a unit vector
    this.speed = 60;
    this.numSegments = 20;
    this.radius = 30;
    this.nextSegment = new Bugsegment(this, 5, this.radius);
    this.isCaught = false;
    this.beatInfo = false;
    this.wasBeatClicked = false;
    this.breakFreeCount = 0;
    this.BREAK_MAX = 3;
    this.rageTime = 0;
    this.frame = 0;
  }

  update(dt) {
    if (!this.isCaught) {
      // move and keep in bounds
      let newPosition = Vec2.add(this.position, this.forward.clone().scale(this.speed * dt));
      if (newPosition.x < 30) {
        this.forward.x += 0.02;
        this.forward.normalize();
      } else if (newPosition.x > window.innerWidth - 30) {
        this.forward.x -= 0.02;
        this.forward.normalize();
      } else if (newPosition.y > window.innerHeight - 30) {
        this.forward.y -= 0.02;
        this.forward.normalize();
      } else if (newPosition.y < 30) {
        this.forward.y += 0.02;
        this.forward.normalize();
      }
      newPosition = Vec2.add(this.position, this.forward.clone().scale(this.speed * dt));
      this.position.copy(newPosition);
    }

    if (this.breakFreeCount >= this.BREAK_MAX) {
      this.nextSegment.startRage();
      this.rageTime = 2 + 2 * Math.random();
      this.isCaught = false;
      this.nextSegment.breakBeat();
    }

    if (this.rageTime > 0) {
      this.rageTime -= dt;
      this.forward.x += 0.03;
      this.forward.normalize();

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
    if (!this.isCaught) this.nextSegment.frameUpdate();
  }

  beatUpdate() {
    this.nextSegment.beatUpdate();
  }

  completeBeat() {
    this.isCaught = false;
    this.nextSegment.startRage();
    this.rageTime = 2 + 2 * Math.random();
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
      this.isCaught = true;
      this.nextSegment.triggerBeat(0);
    }
  }

  draw(ctx) {
    this.nextSegment.draw(ctx);
    ctx.save();

    let img = this.beatInfo ? headImg.yellow[this.frame] : headImg.green[this.frame];
    if (this.rageTime > 0) img = headImg.red(this.frame);
    const ratio = 140 / img.width;
    const w = img.width * ratio;
    const h = img.height * ratio;

    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.forward.angle() - Math.PI / 2);
    ctx.drawImage(img, -w / 2, -h / 2 + 15, w, h);

    ctx.restore();
  }
}

export default BugHead;
