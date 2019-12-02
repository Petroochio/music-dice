import Vec2 from '../Utils/Vec2';
import * as Mechamarkers from '../Mechamarkers';

class BeatButton {
  constructor(groupId, clickBeat, centerOffset) {
    this.wasDown = false;
    this.input = Mechamarkers.getGroup(groupId);
    this.centerOffset = centerOffset;
    this.position = new Vec2(0, 0);
    this.clickBeat = clickBeat;
  }

  update(dt) {
    if (this.input && this.input.present) {
      this.position.copy(Mechamarkers.mapPointToCanvas(this.input.pos, window.innerWidth, window.innerHeight));
      const offsetCopy = this.centerOffset.clone().rotate(-this.input.angle);
      this.position.add(offsetCopy);
      const isDown = this.input.getInput('button').val > 0.5;
      if (!this.wasDown && isDown) {
        this.clickBeat(this.position);
      }

      this.wasDown = isDown;
    }
  }

  draw(ctx) {
    if (this.input && this.input.present) {
      ctx.save();
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'white';
      ctx.translate(this.position.x, this.position.y);
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }
}

export default BeatButton;
