import * as Mechamarkers from '../Mechamarkers';
import Vec2 from '../Utils/Vec2';

class Dice {
  constructor(markers) {
    this.markers = markers;
    this.present = false;
    this.position = new Vec2(-100, -100);
  }

  update(dt) {
    this.present = false;

    this.markers.forEach(m => {
      if (m.present) {
        this.present = true;
        this.markerShown = m;
        this.position.copy(Mechamarkers.mapPointToCanvas(m.center, window.innerWidth, window.innerHeight));
      }
    });
  }
}

export default Dice;
