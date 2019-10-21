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
let wasGrabberDown = false;

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

    stringTrackspawn = new TrackSpawn(new Vec2(window.innerWidth / 2 - 300, 70), stringSet, 'STRING', addTrack);
    marimbaTrackspawn = new TrackSpawn(new Vec2(window.innerWidth / 2, 70), marimbaSet, 'MARIMBA', addTrack);
    drumTrackspawn = new TrackSpawn(new Vec2(window.innerWidth / 2 + 300, 70), drumSet, 'DRUM', addTrack);

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

  // Mechamarkers stuff
  // Switch Gate
  const toggle = Mechamarkers.getGroup('track-toggle');
  const grabber = Mechamarkers.getGroup('track-grabber');

  // Switch logic
  if (toggle && toggle.isPresent()) {
    const togglePoint = Vec2.copy(Mechamarkers.mapPointToCanvas(toggle.pos, window.innerWidth, window.innerHeight));
    const targetTrack = tracks.find(t => t.position.dist(togglePoint) < 50);

    if (targetTrack) targetTrack.setSample(!(toggle.getInput('toggle').val > 0.5) ? 0 : 1);
  }

  if (grabber && grabber.isPresent()) {
    const grabPoint = Vec2.copy(Mechamarkers.mapPointToCanvas(grabber.pos, window.innerWidth, window.innerHeight));

    if (mouseHeldTrack) {
      mouseHeldTrack.position.copy(grabPoint);
    } else if (mouseHeldMix) {
      mouseHeldMix.position.copy(grabPoint);
    }

    if (!wasGrabberDown) {
      const clickedTrack = tracks.find(t => t.position.dist(grabPoint) < 70);
      if (clickedTrack) {
        mouseHeldTrack = clickedTrack;
        mouseHeldTrack.isHeld = true;
        mouseHeldTrack.play();
      } else {
        const clickedMix = mixes.find(m => m.position.dist(grabPoint) < 70);
        if (clickedMix) {
          mouseHeldMix = clickedMix;
          mouseHeldMix.isHeld = true;
          mouseHeldMix.play();
        }
      }
    }

    wasGrabberDown = true;
  } else {
    if (wasGrabberDown) {
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
    }
    wasGrabberDown = false;
  }

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

  // Mechamarkers draw
  const toggle = Mechamarkers.getGroup('track-toggle');
  const grabber = Mechamarkers.getGroup('track-grabber');
  if (toggle && toggle.isPresent()) {
    const togglePoint = Vec2.copy(Mechamarkers.mapPointToCanvas(toggle.pos, window.innerWidth, window.innerHeight));
    ctx.save();
    ctx.translate(togglePoint.x, togglePoint.y);

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

window.onload = () => {
  prevTime = Date.now();
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  Mechamarkers.init(canvas, ctx);

  // Init and push all sounds to sound array
  drumSet = new SampleSet(
    [
      './audio/Acid House/AH-Drums-1.wav',
      './audio/Acid House/AH-Drums-2.wav',
    ],
    'DRUM'
  );

  // Marimba
  marimbaSet = new SampleSet(
    [
      './audio/Acid House/AH-Bass-1.wav',
      './audio/Acid House/AH-Bass-2.wav',
    ],
    'MARIMBA'
  );

  // Strings
  stringSet = new SampleSet(
    [
      './audio/Acid House/AH-Vocals-1.wav',
      './audio/Acid House/AH-Vocals-2.wav',
    ],
    'STRING'
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