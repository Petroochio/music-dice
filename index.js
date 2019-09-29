import Vec2 from './src/Utils/Vec2';

import * as Mechamarkers from './src/Mechamarkers';
import SampleSet from './src/Actors/SampleSet';
import TrackSpawn from './src/Actors/TrackSpawn';
import TrackMix from './src/Actors/TrackMix';
import Trash from './src/Actors/Trash';

let canvas, ctx, prevTime;

// debug mouse stuff
const mouseVec = new Vec2(0, 0);
let isMouseDown = false;
let mouseHeldTrack = null;
let mouseHeldMix = null;

let stringSet, marimbaSet, drumSet;
let stringTrackspawn, marimbaTrackspawn, drumTrackspawn;
let tracks = [];
let mixes = [];
const trash = new Trash(new Vec2(10, 500));

function addTrack(newTrack) {
  tracks.push(newTrack);
}

function preload() {
  let notLoaded = true;
  notLoaded = !(marimbaSet.areAllSamplesLoaded() && stringSet.areAllSamplesLoaded() && drumSet.areAllSamplesLoaded());
  if (notLoaded) {
    window.requestAnimationFrame(preload);
  } else {
    stringSet.startAllSamples();
    marimbaSet.startAllSamples();
    drumSet.startAllSamples();

    stringTrackspawn = new TrackSpawn(new Vec2(100, 20), stringSet, 'STRING', addTrack);
    marimbaTrackspawn = new TrackSpawn(new Vec2(300, 20), marimbaSet, 'MARIMBA', addTrack);
    drumTrackspawn = new TrackSpawn(new Vec2(500, 20), drumSet, 'DRUM', addTrack);

    window.requestAnimationFrame(update);
  }
}

function update() {
  const currTime = Date.now();
  const dt = (currTime - prevTime) / 1000;
  prevTime = currTime;

  Mechamarkers.update(currTime);

  // Update spawners and tracks
  stringTrackspawn.update(dt);
  marimbaTrackspawn.update(dt);
  drumTrackspawn.update(dt);
  tracks.forEach(t => t.update(dt));
  mixes.forEach(m => m.update(dt));
  trash.update(dt);

  draw();
  window.requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(-1, -1, canvas.width + 1, canvas.height + 1);

  // Draw all tracks and spawns
  trash.draw(ctx);
  stringTrackspawn.draw(ctx);
  marimbaTrackspawn.draw(ctx);
  drumTrackspawn.draw(ctx);
  tracks.forEach(t => t.draw(ctx));
  mixes.forEach(m => m.draw(ctx));
}

window.onload = () => {
  prevTime = Date.now();
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  Mechamarkers.init(canvas, ctx);

  // Init and push all sounds to sound array
  drumSet = new SampleSet(
    [
      './audio/Electronic_Beat_1.wav',
      './audio/Electronic_Beat_2.wav',
      './audio/Electronic_Beat_3.wav',
      './audio/Conga_Beat_1.wav',
      './audio/Conga_Beat_2.wav',
      './audio/Kit_Beat_1.wav',
    ],
    'DRUMS'
  );

  // Marimba
  marimbaSet = new SampleSet(
    [
      './audio/Marimba_Tune_1.wav',
      './audio/Marimba_Tune_2.wav',
      './audio/Marimba_Tune_3.wav',
      './audio/Marimba_Tune_4.wav',
      './audio/Marimba_Tune_5.wav',
      './audio/Marimba_Tune_6.wav',
    ],
    'MARIMBA'
  );

  // Strings
  stringSet = new SampleSet(
    [
      './audio/Strings_Tune_1.wav',
      './audio/Strings_Tune_2.wav',
      './audio/Strings_Tune_3.wav',
      './audio/Strings_Tune_4.wav',
      './audio/Strings_Tune_5.wav',
      './audio/Strings_Tune_6.wav',
    ],
    'STRINGS'
  );

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Mouse debug controls
  canvas.addEventListener('mousemove', ({ clientX, clientY }) => {
    mouseVec.set(clientX, clientY);
    if (isMouseDown) {
      if (mouseHeldTrack) {
        mouseHeldTrack.position.copy(mouseVec);
      } else if (mouseHeldMix) {
        mouseHeldMix.position.copy(mouseVec);
      }
    } 
  });
  canvas.addEventListener('mousedown', () => {
    isMouseDown = true;

    const clickedTrack = tracks.find(t => t.pointInRange(mouseVec));
    if (clickedTrack) {
      mouseHeldTrack = clickedTrack;
      mouseHeldTrack.isHeld = true;
      mouseHeldTrack.play();
    } else {
      const clickedMix = mixes.find(m => m.pointInRange(mouseVec));
      if (clickedMix) {
        mouseHeldMix = clickedMix;
        mouseHeldMix.isHeld = true;
        mouseHeldMix.play();
      }
    }
  });

  const clearMouse = () => {
    isMouseDown = false;
    if (mouseHeldTrack) {
      mouseHeldTrack.stop();

      // Combine two tracks and remove them from array
      const dropTrack = tracks.find(t =>
        (!t.isHeld && t.circleInRange(mouseHeldTrack) && t.sampleSet.name !== mouseHeldTrack.sampleSet.name)
      );
      mouseHeldTrack.isHeld = false; // Gotta do this here or it will hit itself

      // First check if it's on trash
      if (mouseHeldTrack.circleInRange(trash)) {
        mouseHeldTrack.isTrashed = true;
        tracks = tracks.filter(t => !t.isTrashed);
      } else if (dropTrack && dropTrack.isFree) {
        const mix = new TrackMix(
          dropTrack.position.clone(),
          [
            [dropTrack.sampleSet, dropTrack.currentSample],
            [mouseHeldTrack.sampleSet, mouseHeldTrack.currentSample],
          ]
        );
        
        dropTrack.hasDropped = true;
        mouseHeldTrack.hasDropped = true;

        mixes.push(mix);
        tracks = tracks.filter(t => !t.hasDropped);
      } else {
        const dropMix = mixes.find(m =>
          (m.circleInRange(mouseHeldTrack) && !m.hasSet(mouseHeldTrack.sampleSet.name))
        );
        if (dropMix) {
          dropMix.addTrack(mouseHeldTrack);
          mouseHeldTrack.hasDropped = true;
          tracks = tracks.filter(t => !t.hasDropped);
        }
      }

      mouseHeldTrack = null;
    } else if (mouseHeldMix) {
      mouseHeldMix.stop();

      if (mouseHeldMix.circleInRange(trash)) {
        mouseHeldMix.isTrashed = true;
        mixes = mixes.filter(m => !m.isTrashed);
      }
      mouseHeldMix = null;
    }
  };
  canvas.addEventListener('mouseup', clearMouse);
  canvas.addEventListener('mouseout', clearMouse);

  preload();
}