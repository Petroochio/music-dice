import * as R from 'ramda';
import { getBeat } from '../Utils/BeatMarkups';
import Vec2 from '../Utils/Vec2';

const hexPoints = [
  new Vec2(-1, 0),
  new Vec2(-0.5, -0.7),
  new Vec2(0.5, -0.7),
  new Vec2(1, 0),
  new Vec2(0.5, 0.7),
  new Vec2(-0.5, 0.7),
];

const triPoints = [
  new Vec2(-0.5, 0.7),
  new Vec2(0.5, 0.7),
  new Vec2(0, -0.2),
];

class BugSegment {
  constructor(prevSegment, numSegments, prevSegmentRadius, beatColor) {
    this.prevSegment = prevSegment;
    this.radius = 25;
    if (numSegments === 2) this.radius *= 0.8;
    if (numSegments === 1) this.radius *= 0.6;
    if (numSegments === 0) this.radius *= 0.4;
    this.moveOffset = this.radius + prevSegmentRadius;
    this.position = prevSegment.position.clone();
    // this.position.x -= this.moveOffset;
    this.nextSegment = numSegments > 0 ? new BugSegment(this, numSegments - 1, this.radius * 0.5, beatColor) : null;
    this.beatInfo = false;
    this.shouldLoadBeat = false;
    this.isPlayingBeat = false;
    this.beatNum = 0;
    this.frame = numSegments % 3;
    this.isRage = false;
    this.currentBeat = [];
    this.beatColor = beatColor
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
        if (this.beatNum < this.currentBeat.length - 1) {
          this.beatNum += 1;
          if (this.beatNum > -1) this.passBeat((this.currentBeat[this.beatNum] === 1));
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

  getNumSegments() {
    if (this.nextSegment) return this.nextSegment.getNumSegments() + 1;
    else return 1;
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

  triggerBeat(beatOffset, track1, track2) {
    if (this.nextSegment) this.nextSegment.triggerBeat(beatOffset, track1, track2);
    else {
      this.beatNum = beatOffset;
      // this.shouldLoadBeat = true;
      this.isPlayingBeat = true;
      this.currentBeat = R.concat(getBeat(track1), getBeat(track2));
      if (this.beatNum > -1) this.beatInfo = (this.currentBeat[this.beatNum] === 1);
    }
  }

  draw(ctx) {
    if (this.nextSegment) this.nextSegment.draw(ctx);
    const forward = Vec2.sub(this.position, this.prevSegment.position);
    let size = this.radius * 0.9;

    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(forward.angle() - Math.PI / 2);

    let color = 'white';
    if (this.isRage) color = 'red';
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(hexPoints[5].x * size, hexPoints[5].y * size);
    hexPoints.forEach(p => {
      ctx.lineTo(p.x * size, p.y * size);
    });
    ctx.fill();

    color = this.beatInfo ? this.beatColor : 'black';
    if (this.isRage) color = 'red';
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(triPoints[2].x * size, triPoints[2].y * size);
    triPoints.forEach(p => {
      ctx.lineTo(p.x * size, p.y * size);
    });
    ctx.fill();

    ctx.restore();
  }
}

export default BugSegment;
