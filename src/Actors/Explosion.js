import Vec2 from "../Utils/Vec2";

const explosion = [new Image(), new Image(), new Image(), new Image(), new Image()];
explosion[0].src = './assets/explosion/Explosion_Deluxe_1.png';
explosion[1].src = './assets/explosion/Explosion_Deluxe_2.png';
explosion[2].src = './assets/explosion/Explosion_Deluxe_3.png';
explosion[3].src = './assets/explosion/Explosion_Deluxe_4.png';
explosion[4].src = './assets/explosion/Explosion_Deluxe_5.png';

class Explosion {
  constructor() {
    this.frame = 6;
    this.position = new Vec2(0, 0);
  }

  start(pos) {
    this.position.copy(pos);
    this.frame = 0;
  }
  
  frameUpdate() {
    if (this.frame < 5) this.frame += 1;
  }

  draw(ctx) {
    if (this.frame < 5) {
      ctx.save();

      let img = explosion[this.frame];
      const ratio = 80 / img.width;
      const w = img.width * ratio;
      const h = img.height * ratio;

      ctx.translate(this.position.x, this.position.y);
      ctx.drawImage(img, -w / 2, -h / 2 + 15, w, h);

      ctx.restore();
    }
  }
}

export default Explosion;