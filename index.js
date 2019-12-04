import * as R from 'ramda';
import Vec2 from './src/Utils/Vec2';

import * as Mechamarkers from './src/Mechamarkers';
import * as TrackManager from './src/TrackManager';
import * as ImgManager from './src/ImgManager';
import { getRandomTracks } from './src/Utils/BeatMarkups';
import DiceWall from './src/Actors/DiceWall';
import BugHead from './src/Actors/BugHead';
import BeatButton from './src/Actors/BeatButton';

let canvas, ctx, prevTime, diceWall;
const bugs = [
  new BugHead(new Vec2(window.innerWidth * 0.1, 300), 10, 0),
  new BugHead(new Vec2(window.innerWidth * 0.9, 300), 7, 1)
];

const VW = window.innerWidth;
const VH = window.innerHeight;

let sixTeenthCount = 0;
let eighthBeatCount = 0;
let quarterBeatCount = 0;
let halfBeatCount = 0;
let fullBeatCount = 0;
const bpm = 159;
let SIXTEENTH_MEASURE = 60 / (bpm * 4);
let EIGHTH_MEASURE = 60 / (bpm * 2);
let QUARTER_MEASURE = 60 / bpm
let HALF_MEASURE = 60 / (bpm / 2);
let FULL_MEASURE = 60 / (bpm / 4);
let loopCount = 0;
let LOOP_MAX = 16;

// beat click logic
let wasBeatButtonDown = false;
let isBeatButtonDown = false;
let beatButtonPos = new Vec2(-10, -10);
const beatButtons = [];

function preload() {
  if (!TrackManager.checkLoaded()) {
    window.requestAnimationFrame(preload);
  } else {
    TrackManager.startTracks();
    TrackManager.justDrums();
    loopCount = 0;
    diceWall = new DiceWall();

    window.requestAnimationFrame(update);
  }
}

let combo1, combo2;
let bugsTrappedLoop = 0;
function update() {
  const currTime = Date.now();
  const dt = (currTime - prevTime) / 1000;
  prevTime = currTime;

  if (loopCount >= LOOP_MAX) {
    loopCount = 0;

    if (bugsTrappedLoop > 0) {
      bugsTrappedLoop -= 1;
      if (bugsTrappedLoop === 1) {
        TrackManager.playSet(bugs.map(b => combo2[b.bugID]));
        TrackManager.justDrums();
        // play combo 2
        bugs.forEach(b => {
          if (b.isPlaying) {
            TrackManager.maxTrack(b.bugID);
          }
        })
      }

      if (bugsTrappedLoop === 0) TrackManager.justDrums();
    }

    // loop reset stuff
    if (R.all(b => (b.isCaught && b.isPlaying && !b.beatTriggered), bugs)) {
      bugsTrappedLoop = 3;
      
      const maxSegments = bugs.reduce((max, b) => R.max(b.getNumSegments(), max), 0);

      combo1 = getRandomTracks();
      combo2 = getRandomTracks();

      // play combo 1
      bugs.forEach(b => b.trackLooped(maxSegments, combo1, combo2));
      TrackManager.playSet(bugs.map(b => combo1[b.bugID]));
    }
  }

  // Beat timers
  sixTeenthCount += dt;
  if (sixTeenthCount >= SIXTEENTH_MEASURE) {
    sixTeenthCount = sixTeenthCount % SIXTEENTH_MEASURE;
  }


  eighthBeatCount += dt;
  if (eighthBeatCount >= EIGHTH_MEASURE) {
    eighthBeatCount = eighthBeatCount % EIGHTH_MEASURE;
    bugs.forEach(b => b.frameUpdate());
    bugs.forEach(b => b.beatUpdate());
  }

  quarterBeatCount += dt;
  if (quarterBeatCount >= QUARTER_MEASURE) {
    quarterBeatCount = quarterBeatCount % QUARTER_MEASURE;
    // centipede.beatUpdate();
    diceWall.beatUpdate();
    loopCount += 1;
  }

  halfBeatCount += dt;
  if (halfBeatCount >= HALF_MEASURE) {
    halfBeatCount = halfBeatCount % HALF_MEASURE;
  }

  fullBeatCount += dt;
  if (fullBeatCount >= FULL_MEASURE) {
    fullBeatCount = fullBeatCount % FULL_MEASURE;
  }

  // Mechamarkers needs to be updated every frame
  Mechamarkers.update(currTime);

  // Game logic
  diceWall.update(dt);
  bugs.forEach(b => {
    if (!b.isCaught && diceWall.checkCircleCollision(b.position, b.radius)) {
      b.getCaught();
      if (!b.isCaught) diceWall.breakWall(b.position, b.radius);
    }
    b.update(dt);
  });
  // Play all
  if (R.all(b => (b.isCaught && !b.isPlaying), bugs)) bugs.forEach(b => b.triggerPlay());
  beatButtons.forEach(b => b.update(dt));

  
  draw();
  window.requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(-1, -1, canvas.width + 1, canvas.height + 1);
  bugs.forEach(b => b.draw(ctx));
  diceWall.draw(ctx);
  beatButtons.forEach(b => b.draw(ctx));
}

function clickBeat(p) {
  if (p.dist(centipede.position) < 40) {
    centipede.clickBeat();
  }
}

window.onload = () => {
  prevTime = Date.now();
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  Mechamarkers.init(canvas, ctx);
  TrackManager.init();
  ImgManager.init();

  beatButtons.push(new BeatButton('beat_button_1', clickBeat, new Vec2(0, 0)));

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Mouse debug stuff
  // canvas.addEventListener('mousedown', () => isBeatButtonDown = true);
  // canvas.addEventListener('mouseup', () => isBeatButtonDown = false);
  // canvas.addEventListener('mousemove', (e) => beatButtonPos.set(e.clientX, e.clientY));

  preload();
}