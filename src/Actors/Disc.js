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
    this.position = new Vec2(window.innerWidth / 2, window.innerHeight / 2);
    this.rotation = 0;
    this.radiusMod = 1;
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
    this.radiusMod = 3;
  }

  rotate() {
    if (this.inUse) {
      this.rotation += Math.PI / 10;
    }
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

    if (this.isPlaying) {
      if (this.radiusMod > 1) {
        this.radiusMod -= 1.5 * dt;
      } else {
        this.radiusMod = 1;
      }
    }

    // set position from marker
    if (this.marker.present) {
      this.position.copy(Mechamarkers.mapPointToCanvas(this.marker.center, window.innerWidth, window.innerHeight));
    } else {
      this.position.set(-1000, -1000);
    }
  }

  draw(ctx) {
    ctx.save();

    const shapeSize = 40;
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.arc(0, 0, 55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(30, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    const xaxis = new Vec2(15 * this.radiusMod, 0);

    ctx.beginPath();
    ctx.moveTo(xaxis.x, xaxis.y);
    for (let i=1; i < this.component + 3; i++) {
      xaxis.rotate(Math.PI * 2 / (this.component + 2));
      ctx.lineTo(xaxis.x, xaxis.y);
    }
    ctx.stroke();

    ctx.restore();
  }
}

export default Disc;
