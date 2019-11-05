import { any } from 'ramda';
import * as Mechamarkers from '../Mechamarkers';
const w = 30;

class Dice {
  constructor(position, markers) {
    this.present = true;// false;
    this.position = position;
    this.markers = markers.map(m => Mechamarkers.getMarker(m));
  }

  update(dt) {
    // set position from provided markers
    // this.present = any(m => m.present, this.markers);
    // if (this.present) {
    //   const presentMarker = this.markers.find(m => m.present);
    //   this.position.copy(Mechamarkers.mapPointToCanvas(presentMarker.center, window.innerWidth, window.innerHeight));
    // }
  }

  draw(ctx) {
    if (this.isPresent) {
      ctx.save();

      ctx.strokeStyle = 'red';
      ctx.translate(this.position.x - w/2, this.position.y - w/2);
      ctx.beginPath();
      ctx.rect(0, 0, w, w);
      ctx.stroke();

      ctx.restore();
    }
  }
}

export default Dice;