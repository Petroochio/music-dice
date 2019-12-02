import pz from 'pizzicato';

let numTracks = 0;
let loadedTracks = 0;
const trackSource = [
  // ['house', './audio/House-1/House-1 CLP+SNR.wav', './audio/House-1/House-1 Kick.wav', './audio/House-1/House-1 Major Strings.wav', './audio/House-1/House-1 Piano Major.wav'],
  [
    'meanie',
    './audio/meanie/Meanie Music-90 Bpm 1-closed hihat.wav',
    './audio/meanie/Meanie Music-90 Bpm 2-sn_21.wav',
    './audio/meanie/Meanie Music-90 Bpm 3-clap1.wav',
    './audio/meanie/Meanie Music-90 Bpm 4-hand clap.wav',
    './audio/meanie/Meanie Music-90 Bpm 5-kick_jazz_c.wav',
    './audio/meanie/Meanie Music-90 Bpm 6-Poli.wav',
    './audio/meanie/Meanie Music-90 Bpm 7-Operator.wav',
    './audio/meanie/Meanie Music-90 Bpm 8-Mortal.wav',
  ],
];
const tracks = {};

export function init() {
  trackSource.forEach(([name, s1, s2, s3, s4, s5, s6, s7, s8]) => {
    numTracks = 8;

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
    console.log('wat');
    let sound4 = new pz.Sound(s4, () => loadedTracks += 1);
    sound4.loop = true;
    sound4.volume = 0.5;
    sound4.attack = 0.5;
    sound4.detatch = 2;

    let sound5 = new pz.Sound(s5, () => loadedTracks += 1);
    sound5.loop = true;
    sound5.volume = 0.5;
    sound5.attack = 0.5;
    sound5.detatch = 2;

    let sound6 = new pz.Sound(s6, () => loadedTracks += 1);
    sound6.loop = true;
    sound6.volume = 0.5;
    sound6.attack = 0.5;
    sound6.detatch = 2;

    let sound7 = new pz.Sound(s7, () => loadedTracks += 1);
    sound7.loop = true;
    sound7.volume = 0.5;
    sound7.attack = 0.5;
    sound7.detatch = 2;

    let sound8 = new pz.Sound(s8, () => loadedTracks += 1);
    sound8.loop = true;
    sound8.volume = 0.5;
    sound8.attack = 0.5;
    sound8.detatch = 2;
    console.log('wat 2');
    tracks[name] = new pz.Group([sound1, sound2, sound3, sound4, sound5, sound6, sound7, sound8]);
  });
}

export function startTracks() {
  tracks['meanie'].play();
}

export function highlightTrack() {
  tracks['meanie'].sounds[0].volume = 0.1;
  tracks['meanie'].sounds[2].volume = 0.1;
  tracks['meanie'].sounds[3].volume = 0.1;
  tracks['meanie'].sounds[4].volume = 0.1;
  // tracks['meanie'].sounds[5].volume = 0.1;
  // tracks['meanie'].sounds[6].volume = 0.1;
  tracks['meanie'].sounds[7].volume = 0.1;
}

export function balanceTrack() {
  tracks['meanie'].sounds[0].volume = 1;
  tracks['meanie'].sounds[2].volume = 1;
  tracks['meanie'].sounds[3].volume = 1;
  tracks['meanie'].sounds[4].volume = 1;
  tracks['meanie'].sounds[5].volume = 1;
  tracks['meanie'].sounds[6].volume = 1;
  tracks['meanie'].sounds[7].volume = 1;
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
