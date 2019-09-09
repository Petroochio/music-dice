import pz from 'pizzicato';

import * as Mechamarkers from './src/Mechamarkers';

let canvas, ctx, prevTime;
let loadedSongs = 0;
let triggeredPlay = false;

const markerSoundMap = [];
function checkCanPlay() {
  if (!triggeredPlay && loadedSongs >= markerSoundMap.length) {
    triggeredPlay = true;
    markerSoundMap.forEach(([_, s]) => {
      s.loop = true;
      s.volume = 0;
      s.attack = 2;
      s.detatch = 1.5;
      s.play();
    });
  }
}

let tempSongTimer = 4500;

function update() {
  const currTime = Date.now();
  const dt = currTime - prevTime;
  prevTime = currTime;

  checkCanPlay();

  Mechamarkers.update(currTime);

  // if (tempSongTimer < 0) {
  //   // if (markerSoundMap[2][1].volume > 0.1) markerSoundMap[2][1].volume = 0.01;
  //   // else markerSoundMap[2][1].volume = 0.8;
  //   // tempSongTimer = 10000;
  //   // markerSoundMap[8][1].volume = 0.8;
  // }
  // tempSongTimer -= dt;

  markerSoundMap.forEach(([mid, sound]) => {
    if (Mechamarkers.getMarker(mid).present) {
      // set sound volume high
    } else {
      // set sound volume low
    }
  });

  window.requestAnimationFrame(update);
}

window.onload = () => {
  prevTime = Date.now();
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  Mechamarkers.init(canvas, ctx);

  // Init and push all sounds to sound array
  // Percussion
  markerSoundMap.push([0, new pz.Sound('./audio/Electronic_Beat_1.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Electronic_Beat_2.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Electronic_Beat_3.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Conga_Beat_1.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Conga_Beat_2.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Kit_Beat_1.wav', () => loadedSongs += 1)]);

  // Marimba
  markerSoundMap.push([0, new pz.Sound('./audio/Marimba_Tune_1.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Marimba_Tune_2.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Marimba_Tune_3.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Marimba_Tune_4.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Marimba_Tune_5.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Marimba_Tune_6.wav', () => loadedSongs += 1)]);

  // Strings
  markerSoundMap.push([0, new pz.Sound('./audio/Strings_Tune_1.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Strings_Tune_2.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Strings_Tune_3.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Strings_Tune_4.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Strings_Tune_5.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([0, new pz.Sound('./audio/Strings_Tune_6.wav', () => loadedSongs += 1)]);

  window.requestAnimationFrame(update);
}