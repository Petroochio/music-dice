import Vec2 from '../Utils/Vec2';
import Track from './Track';

const TRACK_SPAWN_MAX = 2000;

class TrackSpawn {
  constructor(position, sampleSet, symbol, addTrack) {
    this.position = position;
    this.sampleSet = sampleSet;
    this.addTrack = addTrack;
    this.trackSpawnTime = 0;
    this.currentTrack = null;
    this.symbol = symbol;
  }

  update(dt) {
    if (this.trackSpawnTime > 0) this.trackSpawnTime -= dt;
    else if (this.trackSpawnTime < 0 && this.currentTrack === null) {
      this.currentTrack = new Track(
        this.position.clone().add(new Vec2(0, 30)),
        this.sampleSet,
        this.symbol
      );
      this.addTrack(this.currentTrack);
    }
  }

  draw(ctx) {

  }

  takeTrack() {
    this.trackSpawnTime = TRACK_SPAWN_MAX;
    this.currentTrack = null;
  }
}

export default TrackSpawn;
