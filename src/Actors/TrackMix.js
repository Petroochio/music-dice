class TrackMix {
  constructor(position, samples) {
    this.position = position;
    this.samples = samples;
    this.radius = 100;
    this.isPlaying = false;
    this.isHeld = false;
    this.isTrashed = false;
  }

  pointInRange(point) {
    return this.position.dist(point) < this.radius;
  }

  circleInRange(circle) {
    return this.position.dist(circle.position) < this.radius + circle.radius;
  }

  hasSet(setName) {
    return (this.samples.findIndex(([s]) => s.name === setName) !== -1);
  }

  getSetTrack(setName) {
    return (this.samples.find(([s]) => s.name === setName)[1]);
  }

  addTrack(track) {
    this.samples.push([track.sampleSet, track.currentSample])
  }

  update(dt) {

  }

  play() {
    this.samples.forEach(([sampleSet, ID]) => sampleSet.play(ID));
    this.isPlaying = true;
  }

  stop() {
    this.samples.forEach(([sampleSet, ID]) => sampleSet.stop(ID));
    this.isPlaying = false;
  }

  draw(ctx) {
    ctx.save();

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;

    if (this.hasSet('DRUM') && this.hasSet('MARIMBA') && this.hasSet('STRING')) {
      ctx.strokeStyle = 'white';
    } else if (this.hasSet('DRUM') && this.hasSet('MARIMBA')) {
      ctx.strokeStyle = 'orange';
    } else if (this.hasSet('DRUM') && this.hasSet('STRING')) {
      ctx.strokeStyle = 'green';
    } else if (this.hasSet('STRING') && this.hasSet('MARIMBA')) {
      ctx.strokeStyle = 'purple';
    }
  
    ctx.translate(this.position.x, this.position.y);
    ctx.beginPath();
    ctx.strokeRect(-(this.radius + 10) / 2, -(this.radius + 10) / 2, this.radius, this.radius);
    ctx.stroke();

    ctx.restore();
  }
}

export default TrackMix;
