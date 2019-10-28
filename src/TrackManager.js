import pz from 'pizzicato';

let numTracks = 0;
let loadedTracks = 0;
const trackSource = [
  ['acid-house', './audio/Acid House/AH-Vocals.wav', './audio/Acid House/AH-Bass.wav', './audio/Acid House/AH-Drums.wav'],
];
const tracks = {};

export function init() {
  trackSource.forEach(([name, dow, beep, boom]) => {
    numTracks += 3;
    tracks[name] = {};
    tracks[name][0] = new pz.Sound(dow, () => loadedTracks += 1);
    tracks[name][0].loop = true;
    tracks[name][0].volume = 0;
    tracks[name][0].attack = 0.5;
    tracks[name][0].detatch = 2;

    tracks[name][1] = new pz.Sound(beep, () => loadedTracks += 1);
    tracks[name][1].loop = true;
    tracks[name][1].volume = 0;
    tracks[name][1].attack = 0.5;
    tracks[name][1].detatch = 2;

    tracks[name][2] = new pz.Sound(boom, () => loadedTracks += 1);
    tracks[name][2].loop = true;
    tracks[name][2].volume = 0;
    tracks[name][2].attack = 0.5;
    tracks[name][2].detatch = 2;
  });
}

export function startTracks() {
  Object.values(tracks['acid-house']).forEach(t => t.play());
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
