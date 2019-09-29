class SampleSet {
  constuctor(set) {
    this.samples = set;
    this.samples.forEach(sample => {
      sample.loop = true;
      sample.volume = 0;
      sample.attack = 2;
      sample.detatch = 1.5;
      sample.play();
    });
  }

  play(sampleID) {
    // this.samples.forEach((sample, id) => {
    //   sample.volume = id === sampleID ? 1 : 0;
    // });
    this.samples[sampleID].volume = 1;
  }

  stop(sampleID) {
    this.samples[sampleID].volume = 0;
    // this.samples.forEach((sample, id) => {
    //   sample.volume = 0;
    // });
  }
}