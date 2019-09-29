class Track {
  constructor(position, sampleSet, symbol) {
    this.position = position;
    this.symbol = symbol;
    this.sampleSet = sampleSet;
    this.currentSample = 0;
    this.isPlaying = false;
  }

  update(dt) {

  }

  draw(ctx) {

  }

  play() {
    this.sampleSet.play(this.currentSample);
    this.isPlaying = true;
  }

  stop() {
    this.sampleSet.stop(this.currentSample);
    this.isPlaying = false;
  }
}

export default Track;
