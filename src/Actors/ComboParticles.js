import Vec2 from '../Utils/Vec2';

class ComboParticles {
  constructor(pos, combo) {
    this.position = pos.clone();
    this.particles = [];
    this.combo = combo;
    this.comboOffset = 0;
    this.time = 0;

    for(let i = 0; i < 20; i++) {
      this.particles.push({
        pos: new Vec2(0, 0),
        fwd: new Vec2(Math.random() - 0.5, Math.random() - 0.5).normalize(),
        rot: 0,
        factor: Math.random() * 30 + 20,
      });
    }
  }

  update(dt) {
    this.time += dt;

    const timeFactor = (1 - (this.time / 0.5)) * (1 - (this.time / 0.5));
    this.particles.forEach(p => {
      p.pos.addScalar(p.fwd, p.factor * timeFactor);
      p.rot += dt * p.factor;
    });
    this.comboOffset = -70 * (1 -timeFactor);

    if (this.time >= 0.5) this.isDone = true;
  }

  draw(ctx) {
    if (this.isDone) return;

    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    
    const r = Math.random() * 255;
    const g = Math.random() * 255;
    const b = Math.random() * 255;
    const size = 8;
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    this.particles.forEach(p => {
      ctx.save();
      ctx.translate(p.pos.x - (size/2), p.pos.y - (size/2));
      ctx.rotate(p.rot);
      ctx.fillRect(0,0,size,size);
      ctx.restore();
    });

    // ctx.globalAlpha = this.comboOffset > 70 ? 0.1 : 1 - (this.comboOffset / 30)
    ctx.translate(0, this.comboOffset);
    ctx.font = '100px VT323';
    ctx.fillText(this.combo, 0, 0);

    ctx.restore();
  }
}

export default ComboParticles;