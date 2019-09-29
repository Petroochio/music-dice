import Vec2 from '../Utils/Vec2';
import Track from './Track';

const TRACK_SPAWN_MAX = 2;

class TrackSpawn {
  constructor(position, sampleSet, symbol, addTrack) {
    this.position = position;
    this.sampleSet = sampleSet;
    this.addTrack = addTrack;
    this.trackSpawnTime = TRACK_SPAWN_MAX;
    this.currentTrack = null;
    this.symbol = symbol;
  }

  update(dt) {
    if (this.trackSpawnTime > 0) this.trackSpawnTime -= dt;
    else if (!this.currentTrack) {
      this.currentTrack = new Track(
        this.position.clone().add(new Vec2(0, 30)),
        this,
        this.sampleSet,
        this.symbol
      );
      this.addTrack(this.currentTrack);
    }
  }

  draw(ctx) {
    ctx.save();

    ctx.strokeStyle = 'white';
    ctx.translate(this.position.x, this.position.y);
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  freeTrack() {
    this.trackSpawnTime = TRACK_SPAWN_MAX;
    this.currentTrack = null;
  }
}

export default TrackSpawn;
