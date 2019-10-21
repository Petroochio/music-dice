// 0 = none, 1 = base, 2 = distorted
// [ harmonics, beats, drums ]
const TRACK_SETS = [
  [0, 1, 1],
  [0, 2, 1],
  [2, 1, 1],
  [2, 2, 1],
  [1, 2, 1],
  [1, 1, 1],
  [1, 0, 1],
  [2, 0, 1],
];

class Order {
  constructor(position) {
    this.position = position;
    this.goal = TRACK_SETS[Math.round(Math.random() * TRACK_SETS.length - 1)];
  }

  checkMix(mix) {
    if ((this.goal[0] === 0 && mix.hasTrack('MARIMBA')) || this.goal[0] !== mix.getTrackID('MARIMBA') + 1) {
      return false;
    }

    if ((this.goal[1] === 0 && mix.hasTrack('STRING')) || this.goal[1] !== mix.getTrackID('STRING') + 1) {
      return false;
    }

    if ((this.goal[2] === 0 && mix.hasTrack('DRUM')) || this.goal[2] !== mix.getTrackID('DRUM') + 1) {
      return false;
    }

    return true;
  }

  update(dt) {

  }

  draw(ctx) {

  }
}