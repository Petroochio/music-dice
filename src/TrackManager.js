import pz from 'pizzicato';

let numTracks = 0;
let loadedTracks = 0;
const trackSource = [
  ['house', './audio/House-1/House-1 CLP+SNR.wav', './audio/House-1/House-1 Kick.wav', './audio/House-1/House-1 Major Strings.wav', './audio/House-1/House-1 Piano Major.wav'],
];
const tracks = {};

export function init() {
  trackSource.forEach(([name, s1, s2, s3, s4]) => {
    numTracks += 3;

    let sound1 = new pz.Sound(s1, () => loadedTracks += 1);
    sound1.loop = true;
    sound1.volume = 0.5;
    sound1.attack = 0.5;
    sound1.detatch = 2;

    let sound2 = new pz.Sound(s2, () => loadedTracks += 1);
    sound2.loop = true;
    sound2.volume = 0.5;
    sound2.attack = 0.5;
    sound2.detatch = 2;

    let sound3 = new pz.Sound(s3, () => loadedTracks += 1);
    sound3.loop = true;
    sound3.volume = 0.5;
    sound3.attack = 0.5;
    sound3.detatch = 2;

    let sound4 = new pz.Sound(s4, () => loadedTracks += 1);
    sound4.loop = true;
    sound4.volume = 0.5;
    sound4.attack = 0.5;
    sound4.detatch = 2;
    tracks[name] = new pz.Group([sound1, sound2, sound3, sound4]);
  });
}

export function startTracks() {
  tracks['house'].play();
}

export function checkLoaded() {
  return loadedTracks === numTracks;
}

export function playTrack(name, component) {
  tracks[name][component].volume = 1;
}

export function stopTrack(name, component) {
  tracks[name][component].volume = 0;
}
