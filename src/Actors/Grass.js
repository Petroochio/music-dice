import Vec2 from '../Utils/Vec2';

class Grass {
  constructor(position) {
    this.position = position;
    this.points = [];

    for (let i = 0; i < 10; i++) {
      this.points.push({
        x: (Math.random() * 40) - 20,
        y: (Math.random() * 40) - 20,
        isLong: (i % 2 == 0),
      });
    }
  }

  beatUpdate() {
    this.points.forEach(p => p.isLong = !p.isLong);
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.position.x, this.position.y);
    ctx.strokeStyle =  'rgb(68, 235, 85)';
    ctx.lineWidth = 2;

    let offset;
    this.points.forEach(p => {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      offset = p.isLong ? 3 : 7;
      ctx.lineTo(p.x + (offset / 2), p.y - offset);
      ctx.stroke();
    });

    ctx.restore();
  }
}

export default Grass;
