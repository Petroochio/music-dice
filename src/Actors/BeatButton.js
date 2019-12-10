import Vec2 from '../Utils/Vec2';
import * as Mechamarkers from '../Mechamarkers';

class BeatButton {
  constructor(groupID, clickBeat, centerOffset) {
    this.wasDown = false;
    this.groupID = groupID;
    this.input = Mechamarkers.getGroup(groupID);
    this.centerOffset = centerOffset;
    this.position = new Vec2(0, 0);
    this.clickBeat = clickBeat;
    this.isAnimating = false;
    this.animationTime = 0;
  }

  update(dt) {
    if (this.isAnimating) {
      this.animationTime += dt;
    }

    if (this.animationTime > 0.1) {
      this.animationTime = 0;
      this.isAnimating = false;
    }

    if (!this.input) this.input = Mechamarkers.getGroup(this.groupID);

    if (this.input && this.input.isPresent()) {
      this.position.copy(Mechamarkers.mapPointToCanvas(this.input.pos, window.innerWidth, window.innerHeight));
      const offsetCopy = this.centerOffset.clone().rotate(-this.input.angle);
      this.position.add(offsetCopy);
      const isDown = this.input.getInput('button').val > 0.5;

      if (!this.wasDown && isDown) {
        this.clickBeat(this.position);
        this.isAnimating = true;

        this.lines = [];
        for (let i = 0; i < 7; i++) {
          this.lines.push({
            fwd: (new Vec2(Math.random() - 0.5, Math.random() - 0.5)).normalize(),
            s: Math.random() * 40 + 40 
          });
        }
      }

      this.wasDown = isDown;
    }
  }

  draw(ctx) {
    if (this.input && this.input.isPresent()) {
      ctx.save();
      ctx.strokeStyle = 'white';

      ctx.translate(this.position.x, this.position.y);
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);

      ctx.stroke();
      ctx.restore();
    }

    if (this.isAnimating) {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.beginPath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 0.5;

      this.lines.forEach(l => {
        ctx.moveTo(0,0);
        const factor = this.animationTime / 0.1 * l.s;
        ctx.lineTo(l.fwd.x * factor, l.fwd.y * factor);
      });

      ctx.stroke();
      ctx.restore();
    }
  }
}

export default BeatButton;
