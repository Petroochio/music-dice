import BeatMarkup from '../Utils/BeatMarkups';
import Vec2 from '../Utils/Vec2';

const bodyImg = {
  green: [new Image(), new Image(), new Image()],
  yellow: [new Image(), new Image(), new Image()],
  red: [new Image(), new Image(), new Image()],
};
bodyImg.green[0].src = './assets/centipede/blue/tri/Body_1.png';
bodyImg.green[1].src = './assets/centipede/blue/tri/Body_2.png';
bodyImg.green[2].src = './assets/centipede/blue/tri/Body_3.png';
bodyImg.yellow[0].src = './assets/centipede/yellow/Bug_Body_1F.png';
bodyImg.yellow[1].src = './assets/centipede/yellow/Bug_Body_2F.png';
bodyImg.yellow[2].src = './assets/centipede/yellow/Bug_Body_3F.png';
bodyImg.red[0].src = './assets/centipede/red/Bug_Body_1E.png';
bodyImg.red[1].src = './assets/centipede/red/Bug_Body_2E.png';
bodyImg.red[2].src = './assets/centipede/red/Bug_Body_3E.png';

const tailImg = {
  green: [new Image(), new Image(), new Image()],
  yellow: [new Image(), new Image(), new Image()],
  red: [new Image(), new Image(), new Image()],
};
tailImg.green[0].src = './assets/centipede/blue/tri/End_1.png';
tailImg.green[1].src = './assets/centipede/blue/tri/End_2.png';
tailImg.green[2].src = './assets/centipede/blue/tri/End_3.png';
tailImg.yellow[0].src = './assets/centipede/yellow/Bug_Butt_1F.png';
tailImg.yellow[1].src = './assets/centipede/yellow/Bug_Butt_2F.png';
tailImg.yellow[2].src = './assets/centipede/yellow/Bug_Butt_3F.png';
tailImg.red[0].src = './assets/centipede/red/Bug_Butt_1E.png';
tailImg.red[1].src = './assets/centipede/red/Bug_Butt_2E.png';
tailImg.red[2].src = './assets/centipede/red/Bug_Butt_3E.png';

class BugSegment {
  constructor(prevSegment, numSegments, prevSegmentRadius) {
    this.prevSegment = prevSegment;
    this.radius = 23;
    this.moveOffset = this.radius + prevSegmentRadius;
    this.position = prevSegment.position.clone();
    // this.position.x -= this.moveOffset;
    this.nextSegment = numSegments > 0 ? new BugSegment(this, numSegments - 1, this.radius) : null;
    this.beatInfo = false;
    this.beatToLoad = null;
    this.shouldLoadBeat = false;
    this.isPlayingBeat = false;
    this.beatNum = 0;
    this.frame = numSegments % 3;
    this.isRage = false;
  }

  update(dt) {
    // move
    if (this.position.dist(this.prevSegment.position) > this.moveOffset) {
      const moveVec = Vec2.sub(this.position, this.prevSegment.position);
      this.position.add(Vec2.normalize(moveVec).scale(moveVec.mag() - this.moveOffset));
    }
    if (this.nextSegment) this.nextSegment.update(dt);
  }

  breakBeat() {
    this.beatInfo = false;
    this.isPlayingBeat = false;
    if (this.nextSegment) this.nextSegment.breakBeat();
  }

  startRage() {
    this.isRage = true;
    if (this.nextSegment) this.nextSegment.startRage();
  }

  endRage() {
    this.isRage = false;
    if (this.nextSegment) this.nextSegment.endRage();
  }

  loadBeat() {
    if (this.shouldLoadBeat) {
      this.isPlayingBeat = true;

    }
  }

  completeBeat(pos) {
    this.prevSegment.completeBeat(pos);
  }

  deleteTail() {
    this.nextSegment = null;
  }

  checkRemainingBeats() {
    if (this.beatInfo) {
      return true;
    }
    return this.prevSegment.checkRemainingBeats();
  }

  beatUpdate() {
    if (this.nextSegment) this.nextSegment.beatUpdate();
    else {
      if (this.isPlayingBeat) {
        if (this.beatNum < BeatMarkup[this.beatToLoad].length - 1) {
          this.beatNum += 1;
          this.passBeat((BeatMarkup[this.beatToLoad][this.beatNum] === 1));
        } else {
          this.passBeat(false);

          this.isPlayingBeat = this.prevSegment.checkRemainingBeats();
          if (!this.isPlayingBeat) {
            this.prevSegment.completeBeat(this.position);
            this.prevSegment.deleteTail();
          }
        }
      }
    }
  }

  frameUpdate() {
    this.frame += 1;
    this.frame = this.frame % 3;
    if (this.nextSegment) this.nextSegment.frameUpdate();
  }

  passBeat(newBeat) {
    this.prevSegment.passBeat(this.beatInfo);
    this.beatInfo = newBeat;
  }

  triggerBeat(id) {
    if (this.nextSegment) this.nextSegment.triggerBeat(id);
    else {
      this.beatToLoad = id;
      this.beatNum = 0;
      // this.shouldLoadBeat = true;
      this.isPlayingBeat = true;
      this.beatInfo = (BeatMarkup[this.beatToLoad][this.beatNum] === 1);
    }
  }

  draw(ctx) {
    const forward = Vec2.sub(this.position, this.prevSegment.position);
    if (this.nextSegment) {
      this.nextSegment.draw(ctx);
      ctx.save();

      let img = this.beatInfo ? bodyImg.yellow[this.frame] : bodyImg.green[this.frame];
      if (this.isRage) img = bodyImg.red[this.frame];
      const ratio = 120 / img.width;
      const w = img.width * ratio;
      const h = img.height * ratio;

      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(forward.angle() - Math.PI / 2);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    } else {
      ctx.save();
      let img = this.beatInfo ? tailImg.yellow[this.frame] : tailImg.green[this.frame];
      if (this.isRage) img = tailImg.red[this.frame];
      const ratio = 120 / img.width;
      const w = img.width * ratio;
      const h = img.height * ratio;

      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(forward.angle() - Math.PI / 2);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    }
  }
}

export default BugSegment;
