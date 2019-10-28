import Vec2 from '../Utils/Vec2';
import * as Mechamarkers from '../Mechamarkers';
import { playTrack, stopTrack } from '../TrackManager';

const COLOR_MAP = {

};

class Disc {
  constructor(markerID, track, component) {
    this.marker = Mechamarkers.getMarker(markerID);
    this.track = track;
    this.component = component;
    this.isPlaying = false;
    this.inUse = false;
    this.position = new Vec2(0, 0);
  }

  play() {
    playTrack(this.track, this.component);
  }

  stop() {
    stopTrack(this.track, this.component);
  }

  setDistortion() {

  }

  pulse() {

  }

  rotate() {

  }

  update(dt) {
    if (!this.isPlaying && this.inUse) {
      this.isPlaying = true;
      this.play();
    }

    if (this.isPlaying && !this.inUse) {
      this.isPlaying = false;
      this.stop();
    }

    // set position from marker
    // console.log(this.marker);
    if (this.marker.present) {
      this.position.copy(this.marker.center);
    } else {
      this.position.set(-1000, -1000);
    }
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.position.x, this.position.y);
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI);
    ctx.stroke();

    ctx.restore();
  }
}

export default Disc;
