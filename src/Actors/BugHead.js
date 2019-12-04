import Vec2 from '../Utils/Vec2';
import Bugsegment from './BugSegment';
import { dullTrack, maxTrack, stopComboTrack } from '../TrackManager';
// on pass beat check if beat was clicked and reset it
import Explosion from './Explosion';

class BugHead {
  constructor(startPosition, numSegments, bugID) {
    this.bugID = bugID;
    this.position = startPosition;
    this.forward = Vec2.sub(this.position, new Vec2(window.innerWidth / 2, window.innerHeight / 2))
      .normalize(); // should be a unit vector
    this.speed = 100;
    this.radius = 30;
    this.nextSegment = new Bugsegment(this, numSegments, this.radius - 15);
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

    this.pulseMod = 0.7;
  }

  getNumSegments() {
    return this.nextSegment.getNumSegments() + 1;
  }

  update(dt) {
    let moveVec;
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
    this.isPlaying = false;
    this.beatTriggered = true;
    this.breakFreeCount = 0;
    stopComboTrack(this.bugID);
    this.nextSegment.breakBeat();
    // balanceTrack();
  }

  passBeat(newBeat) {
    if (this.beatInfo) {
      // drop beat, auto break free
      if (!this.wasBeatClicked) {
        //this.breakFreeCount += 1;
        // dull track for a few
        //dullTrack(this.bugID);
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
    }
  }

  getCaught() {
    if (!this.isCaught && this.rageTime <= 0) {
      this.isCaught = true;
    }
  }

  trackLooped(maxSegments, combo1, combo2) {
    if (this.isPlaying && !this.beatTriggered) {
      const beatOffset = this.getNumSegments() - maxSegments - 15;
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

    let color = this.beatInfo ? 'yellow' : 'white';
    if (this.wasBeatClicked) color = 'blue';
    if (this.rageTime > 0) color = 'red';
    const squareSize = this.radius * 1.6;
    const halfSize = squareSize / 2;

    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.forward.angle() - Math.PI / 2);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-halfSize, halfSize);
    ctx.lineTo(halfSize, halfSize);
    ctx.lineTo(halfSize, -halfSize * 0.7);
    ctx.lineTo(-halfSize, -halfSize * 0.7);
    ctx.moveTo(-halfSize, halfSize);
    ctx.fill();
    // ctx.fillRect(-halfSize, -halfSize, squareSize, squareSize);

    // mouth part 1
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = squareSize / 7;
    ctx.translate(squareSize / 3, squareSize / 2.5);
    ctx.rotate(Math.PI / 8);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, squareSize / 2.2);
    ctx.stroke();
    ctx.restore();

    // mouth part 2
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = squareSize / 7;
    ctx.translate(-squareSize / 3, squareSize / 2.5);
    ctx.beginPath();
    ctx.rotate(-Math.PI / 8);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, squareSize / 2.2);
    ctx.stroke();
    ctx.restore();


    // eyes
    let eyeSize = squareSize / 2;
    eyeSize *= this.pulseMod;
    const halfEye = eyeSize / 2;
    const thirdSize = squareSize / 2;
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'white';
    ctx.fillRect(-halfEye - halfSize, -halfEye + thirdSize, eyeSize, eyeSize);
    ctx.strokeRect(-halfEye - halfSize, -halfEye + thirdSize, eyeSize, eyeSize);

    ctx.fillRect(-halfEye + halfSize, -halfEye + thirdSize, eyeSize, eyeSize);
    ctx.strokeRect(-halfEye + halfSize, -halfEye + thirdSize, eyeSize, eyeSize);

    ctx.restore();

    this.explosion.draw(ctx);
  }
}

export default BugHead;
