import pz from 'pizzicato';

class SampleSet {
  constructor(srcSet, name) {
    this.name = name;
    this.numTracks = srcSet.length;
    this.loadedTracks = 0;

    // Create a sample pz.sound object for each src provided
    this.samples = srcSet.map(src => new pz.Sound(src, () => this.loadedTracks += 1));
  }

  areAllSamplesLoaded() {
    return this.loadedTracks === this.numTracks;
  }

  startAllSamples() {
    this.samples.forEach(sample => {
      sample.loop = true;
      sample.volume = 1;
      sample.attack = 0.5;
      sample.detatch = 2;
    });
  }

  play(sampleID) {
    // this.samples.forEach((sample, id) => {
    //   sample.volume = id === sampleID ? 1 : 0;
    // });
    if (sampleID >= this.samples.length) {
      throw new Error(`Sample ID ${sampleID} not in scope of set`);
    }
    this.samples[sampleID].play();
  }

  stop(sampleID) {
    if (sampleID >= this.samples.length) {
      throw new Error(`Sample ID ${sampleID} not in scope of set`);
    }
    this.samples[sampleID].stop();
    // this.samples.forEach((sample, id) => {
    //   sample.volume = 0;
    // });
  }
}

export default SampleSet;
