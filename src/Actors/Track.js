class Track {
  constructor(position, spawnParent, sampleSet, symbol) {
    this.position = position;
    this.spawnPosition = position.clone();
    this.spawnParent = spawnParent;
    this.symbol = symbol;
    this.sampleSet = sampleSet;
    this.currentSample = 0;
    this.isPlaying = false;
    this.isHeld = false;
    this.isFree = false;
    this.hasDropped = false;
    this.isTrashed = false;
    this.radius = 40;
  }

  update(dt) {
    if (!this.isFree && this.position.dist(this.spawnPosition) > this.radius) {
      this.isFree = true;
      this.spawnParent.freeTrack();
    }

  }

  pointInRange(point) {
    return this.position.dist(point) < this.radius;
  }

  circleInRange(circle) {
    return this.position.dist(circle.position) < this.radius + circle.radius;
  }

  draw(ctx) {
    ctx.save();

    ctx.strokeStyle = 'white';
    ctx.translate(this.position.x, this.position.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
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
