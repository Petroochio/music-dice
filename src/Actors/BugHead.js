import Vec2 from '../Utils/Vec2';
import Bugsegment from './BugSegment';
import { dullTrack, maxTrack, stopComboTrack } from '../TrackManager';
// on pass beat check if beat was clicked and reset it
import Explosion from './Explosion';

const beatColors = [
  'rgba(211, 25, 150, 1)',
  'rgba(85, 227, 255, 1)',
  'rgba(25, 222, 137, 1)',
];

const hexPoints = [
  new Vec2(-1, 0),
  new Vec2(-0.5, -0.7),
  new Vec2(0.5, -0.7),
  new Vec2(1, 0),
  new Vec2(0.5, 0.7),
  new Vec2(-0.5, 0.7),
];

const leftTriPoints = [new Vec2(-1.2, 0.2), new Vec2(-0.7, 0.9), new Vec2(-0.7, 1.5)];
const rightTriPoints = [new Vec2(1.2, 0.2), new Vec2(0.7, 0.9), new Vec2(0.7, 1.5)];
const leftEye = [new Vec2(-0.9, 0), new Vec2(-0.4, 0.6), new Vec2(-0.3, 0.3)];
const rightEye = [new Vec2(0.9, 0), new Vec2(0.4, 0.6), new Vec2(0.3, 0.3)];

const eyeCatch = [new Vec2(-0.15, -0.15), new Vec2(-0.15, 0.15), new Vec2(0.15, 0.15), new Vec2(0.15, -0.15)];

class BugHead {
  constructor(startPosition, numSegments, bugID, beatMiss, beatHit) {
    this.bugID = bugID;
    this.position = startPosition;
    this.forward = Vec2.sub(this.position, new Vec2(window.innerWidth / 2, window.innerHeight / 2))
      .normalize(); // should be a unit vector
    this.speed = 170;
    this.radius = 37;
    this.beatColor = beatColors[bugID];
    this.nextSegment = new Bugsegment(this, numSegments, this.radius - 15, this.beatColor);
    this.isCaught = false;
    this.isPlaying = false;
    this.beatTriggered = false;
    this.beatInfo = false;
    this.wasBeatClicked = false;
    this.breakFreeCount = 0;
    this.BREAK_MAX = 3;
    this.rageTime = 0;
    this.frame = 0;
    this.explosion = new Explosion();
    this.beatMiss = beatMiss;
    this.beatHit = beatHit;
    this.pulseMod = 0.7;
    this.timeCount = 0;
    this.eyeSpin = 0;
  }

  getNumSegments() {
    return this.nextSegment.getNumSegments() + 1;
  }

  update(dt) {
    let moveVec;
    if (!this.isCaught) {
      // move and keep in bounds
      this.timeCount += dt;
      this.forward.rotate(Math.sin(Date.now() / 300) / 20);

      moveVec = this.rageTime > 0 ? this.forward.clone().scale(this.speed * dt * 2) : this.forward.clone().scale(this.speed * dt);
      let newPosition = Vec2.add(this.position, moveVec);
      if (newPosition.x < 30 && this.forward.x < 0.4) {
        this.forward.x += 0.07;
        this.forward.normalize();
      } else if (newPosition.x > window.innerWidth - 30 && this.forward.x > -0.4) {
        this.forward.x -= 0.07;
        this.forward.normalize();
      } else if (newPosition.y > window.innerHeight - 30 && this.forward.y > -0.4) {
        this.forward.y -= 0.07;
        this.forward.normalize();
      } else if (newPosition.y < 30 && this.forward.y < 0.4) {
        this.forward.y += 0.07;
        this.forward.normalize();
      }
      moveVec = this.rageTime > 0 ? this.forward.clone().scale(this.speed * dt * 2) : this.forward.clone().scale(this.speed * dt);
      newPosition = Vec2.add(this.position, moveVec);
      this.position.copy(newPosition);
    } else {
      this.eyeSpin += dt * 10;
    }

    if (this.breakFreeCount >= this.BREAK_MAX) {
      this.startRage();
    }

    if (this.rageTime > 0) {
      this.rageTime -= dt;

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
    this.rageTime = 5 + 3 * Math.random();
    this.isCaught = false;
    this.isPlaying = false;
    this.beatTriggered = true;
    this.breakFreeCount = 0;
    stopComboTrack(this.bugID);
    this.nextSegment.breakBeat();
  }

  passBeat(newBeat) {
    if (this.beatInfo) {
      // drop beat, auto break free
      if (!this.wasBeatClicked) {
        this.breakFreeCount += 1;
        // dull track for a few
        dullTrack(this.bugID);
        this.beatMiss();
      } if (this.wasBeatClicked) {
        // set volume good
        maxTrack(this.bugID);
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
      this.beatHit(this.position);
    }
  }

  getCaught() {
    if (!this.isCaught && this.rageTime <= 0) {
      this.isCaught = true;
    }
  }

  trackLooped(maxSegments, combo1, combo2) {
    if (this.isPlaying && !this.beatTriggered) {
      const beatOffset = this.getNumSegments() - maxSegments + 16;
      this.beatTriggered = true;
      this.nextSegment.triggerBeat(beatOffset, combo1[this.bugID], combo2[this.bugID]);
    }
  }

  triggerPlay() {
    this.rageTime = 0;
    // highlightTrack();
    this.beatTriggered = false;
    this.isPlaying = true;
  }

  draw(ctx) {
    this.nextSegment.draw(ctx);
    ctx.save();

    let color = this.beatInfo ? this.beatColor : 'white';
    if (this.wasBeatClicked) color = 'blue';
    if (this.rageTime > 0) color = 'red';

    let size = this.radius * 0.9;
    ctx.fillStyle = color;

    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.forward.angle() - Math.PI / 2);

    ctx.beginPath();
    ctx.moveTo(hexPoints[5].x * size, hexPoints[5].y * size);
    hexPoints.forEach(p => {
      ctx.lineTo(p.x * size, p.y * size);
    });
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(leftTriPoints[2].x * size, leftTriPoints[2].y * size);
    leftTriPoints.forEach(p => {
      ctx.lineTo(p.x * size, p.y * size);
    });

    ctx.moveTo(rightTriPoints[2].x * size, rightTriPoints[2].y * size);
    rightTriPoints.forEach(p => {
      ctx.lineTo(p.x * size, p.y * size);
    });
    ctx.fill();

    if (this.isCaught) {
      // left eye
      ctx.save();

      ctx.translate(-0.4 * size, 0.25 * size);
      ctx.rotate(-this.eyeSpin);
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(eyeCatch[3].x * size, eyeCatch[3].y * size);
      eyeCatch.forEach(p => {
        ctx.lineTo(p.x * size, p.y * size);
      });
      ctx.fill();

      ctx.restore();

      // Right eye
      ctx.save();

      ctx.translate(0.4 * size, 0.25 * size);
      ctx.rotate(this.eyeSpin);
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(eyeCatch[3].x * size, eyeCatch[3].y * size);
      eyeCatch.forEach(p => {
        ctx.lineTo(p.x * size, p.y * size);
      });
      ctx.fill();

      ctx.restore();
    } else {
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(leftEye[2].x * size, leftEye[2].y * size);
      leftEye.forEach(p => {
        ctx.lineTo(p.x * size, p.y * size);
      });
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(rightEye[2].x * size, rightEye[2].y * size);
      rightEye.forEach(p => {
        ctx.lineTo(p.x * size, p.y * size);
      });
      ctx.fill();
    }

    ctx.restore();
  }
}

export default BugHead;
