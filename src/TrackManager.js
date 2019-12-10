import pz from 'pizzicato';

let numTracks = 0;
let loadedTracks = 0;
const trackSource = [
  // ['house', './audio/House-1/House-1 CLP+SNR.wav', './audio/House-1/House-1 Kick.wav', './audio/House-1/House-1 Major Strings.wav', './audio/House-1/House-1 Piano Major.wav'],
  ['Bass-A', './audio/CHPTNE/Bass-A.wav'],
  ['Bass-B', './audio/CHPTNE/Bass-B.wav'],
  ['Drums', './audio/CHPTNE/Drums.wav'],
  ['Lead-1-C-1', './audio/CHPTNE/Lead 1-C-1.wav'],
  ['Lead-1-C-2', './audio/CHPTNE/Lead-1-C-2.wav'],
  ['Lead-1-A-1', './audio/CHPTNE/Lead-1-A-1.wav'],
  ['Lead-1-B-1', './audio/CHPTNE/Lead-1-B-1.wav'],
  ['Lead-2-C-1', './audio/CHPTNE/Lead-2-C-1.wav'],
  ['Lead-2-A-1', './audio/CHPTNE/Lead-2-A-2.wav'],
  ['Lead-2-A-2', './audio/CHPTNE/Lead-2-A-1.wav'],
  ['Lead-2-B-1', './audio/CHPTNE/Lead-2-B-1.wav'],
];
const tracks = {};

export function init() {
  trackSource.forEach(([name, source]) => {
    numTracks += 1;
    let sound = new pz.Sound(source, () => loadedTracks += 1);
    sound.loop = true;
    sound.volume = 0.5;
    sound.attack = 0.5;
    sound.detatch = 2;

    tracks[name] = sound;
  });

  tracks.group = new pz.Group(trackSource.map(([name]) => tracks[name]));
}

export function startTracks() {
  tracks.group.play();
}

export function justDrums() {
  trackSource.map(([name]) => tracks[name].volume = 0);
  tracks['Drums'].volume = 1;
}

export function playSet(set) {
  currentSet = set;
  justDrums();
  set.forEach(name => tracks[name].volume = 1);
}

export function checkLoaded() {
  return loadedTracks === numTracks;
}

let currentSet = [];
export function dullTrack(bugID) {
  // tracks[currentSet[bugID]].volume = 0.2;
}
export function maxTrack(bugID) {
  tracks[currentSet[bugID]].volume = 1;
}
export function stopComboTrack(bugID) {
  tracks[currentSet[bugID]].volume = 0;
}

export function playTrack(name) {
  tracks[name].volume = 1;
}

export function stopTrack(name) {
  tracks[name].volume = 0;
}
