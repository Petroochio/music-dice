import Vec2 from '../Utils/Vec2';
import * as Mechamarkers from '../Mechamarkers';

class ButtonAnimation {
  constructor() {
    this.position = new Vec2(0, 0);
    this.animationTime = 2;
    this.scale = 0;
    this.lines = [];
    for (let i = 0; i < 6; i ++) {
      const newVec = new Vec2(1, 0);
      newVec.rotate(Math.PI * 2 * Math.random());
      this.lines.push(newVec);
    }
  }

  trigger(pos) {
    this.position.copy(pos);
    this.animationTime = 0;
    this.scale = 0;
    this.lines.forEach(l => l.rotate(Math.PI * 2 * Math.random()));
  }

  update(dt) {
    if (this.animationTime < 1.5) {
      this.animationTime += dt;
      this.scale += 10 * dt;
    }
  }

  draw(ctx) {
    if (this.animationTime < 1.5) {
      ctx.save();
      console.log('animate');
      ctx.translate(this.position.x, this.position.y);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      this.lines.forEach(l => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(l.x * this.scale, l.y * this.scale);
        ctx.stroke();
      });

      ctx.restore();
    }
  }
}

class BeatButton {
  constructor(groupID, clickBeat, centerOffset) {
    this.wasDown = false;
    this.groupID = groupID;
    this.input = Mechamarkers.getGroup(groupID);
    this.centerOffset = centerOffset;
    this.position = new Vec2(0, 0);
    this.clickBeat = clickBeat;
    this.animation = new ButtonAnimation();
  }

  update(dt) {
    this.animation.update(dt);
    if (!this.input) this.input = Mechamarkers.getGroup(this.groupID);

    if (this.input && this.input.isPresent()) {
      this.position.copy(Mechamarkers.mapPointToCanvas(this.input.pos, window.innerWidth, window.innerHeight));
      const offsetCopy = this.centerOffset.clone().rotate(-this.input.angle);
      this.position.add(offsetCopy);
      const isDown = this.input.getInput('button').val > 0.5;

      if (!this.wasDown && isDown) {
        this.clickBeat(this.position);
        this.animation.trigger(this.position);
      }

      this.wasDown = isDown;
    }
  }

  draw(ctx) {
    if (this.input && this.input.isPresent()) {
      ctx.save();
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'white';
      ctx.translate(this.position.x, this.position.y);
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    this.animation.draw(ctx);
  }
}

export default BeatButton;
