import * as R from 'ramda';
import Vec2 from './src/Utils/Vec2';

import * as Mechamarkers from './src/Mechamarkers';
import * as TrackManager from './src/TrackManager';
import * as ImgManager from './src/ImgManager';
import { getRandomTracks } from './src/Utils/BeatMarkups';
import DiceWall from './src/Actors/DiceWall';
import BugHead from './src/Actors/BugHead';
import BeatButton from './src/Actors/BeatButton';
import Grass from './src/Actors/Grass';
import ComboParticles from './src/Actors/ComboParticles';

let canvas, ctx, prevTime, diceWall;
const bugs = [];
const bugIDs = [0, 1, 2];

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
let LOOP_MAX = 15;
let loseTimer = 100;
let loseRate = 1;
let rateIncreaseTime = 30;
let score = 0;
let combo = 0;

let maxCombo = 0;
let totalTime = 0;

// beat click logic
let wasBeatButtonDown = false;
let isBeatButtonDown = false;
let beatButtonPos = new Vec2(-10, -10);
const beatButtons = [];
const grass = [];
for (let i = 0; i < 12; i++) {
  grass.push(new Grass(new Vec2(Math.random() * window.innerWidth, Math.random() * window.innerHeight)))
}

let gameState = 'START';
function preload() {
  if (!TrackManager.checkLoaded()) {
    window.requestAnimationFrame(preload);
  } else {
    loopCount = 0;
    diceWall = new DiceWall();
    Mechamarkers.fetchInputConfig();

    window.requestAnimationFrame(update);
  }
}

const startPositions = [
  new Vec2(window.innerWidth / 5 * 2, window.innerHeight / 3),
  new Vec2(window.innerWidth / 5 * 3, window.innerHeight / 3),
  new Vec2(window.innerWidth / 2, window.innerHeight / 5),
];
let titleMain;
let colorSwitchTime = 0;
let debugStart = false;
function startUpdate(dt) {
  diceWall.update(dt);
  if (colorSwitchTime < 0) {
    const r = Math.random() * 255;
    const g = Math.random() * 255;
    const b = Math.random() * 255;
    titleMain.setAttribute('style', `text-shadow: -5px 5px rgba(${r}, ${g}, ${b}, 1)`);
    colorSwitchTime = 0.15;
  }
  colorSwitchTime -= dt;

  // if (debugStart) {
  if (diceWall.checkStartPositions(startPositions)) {
    gameState = 'MAIN';
    document.querySelector('#title').classList.add('title-hide');
    TrackManager.startTracks();
    TrackManager.justDrums();
  }
}

function startDraw() {
  startPositions.forEach(p => {
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 30, 0, Math.PI * 2);
    ctx.stroke();
  });

  grass.forEach(g => g.draw(ctx));
  diceWall.draw(ctx);
  beatButtons.forEach(b => b.draw(ctx));

}

function subTime() {
  loseTimer -= loseRate;
  combo = 0;
  loseRate += 0.7;
}

const comboParticles = [];
function addTime(pos) {
  loseTimer += 5;
  combo += 1;
  if (loseTimer > 120) loseTimer = 120;
  comboParticles.push(new ComboParticles(pos, combo));
  if (combo > maxCombo) maxCombo = combo;
}

let bugSpawnTimer = 5;
let timerSize = 3;
let endMain;
function mainUpdate(dt) {
  totalTime += dt;
  if (loseTimer > 0) {
    loseTimer -= dt * loseRate;
  } else {
    gameState = 'END';

    // Spawn a bunch of bugs here
    document.querySelector('#end').classList.add('end-show');
    document.querySelector('.end-score').innerHTML = `Time Survived: ${Math.floor(totalTime)} seconds`;
    document.querySelector('.end-combo').innerHTML = `Max Combo: ${maxCombo}`;

    endMain = document.querySelector('.end-main');
    TrackManager.justBass();
  }

  if (timerSize > 3) timerSize -= dt * 40;

  if (bugSpawnTimer <= 0 && !R.any(b => b.isCaught, bugs)) {
    if (bugIDs.length > 0) {
      bugs.push(
        new BugHead(new Vec2(window.innerWidth / 2, window.innerHeight + 50), 10, bugIDs[0], subTime, addTime)
      );
      bugIDs.splice(0, 1);
    }
    bugSpawnTimer = 40;
  } else {
    bugSpawnTimer -= dt;
  }

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
      } else if (bugsTrappedLoop === 0) TrackManager.justDrums();
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
    timerSize = 16;
  }

  quarterBeatCount += dt;
  if (quarterBeatCount >= QUARTER_MEASURE) {
    quarterBeatCount = quarterBeatCount % QUARTER_MEASURE;
    bugs.forEach(b => b.frameUpdate());
    bugs.forEach(b => b.beatUpdate());
    loopCount += 1;
  }

  halfBeatCount += dt;
  if (halfBeatCount >= HALF_MEASURE) {
    grass.forEach(g => g.beatUpdate());
    halfBeatCount = halfBeatCount % HALF_MEASURE;
    diceWall.beatUpdate();
  }

  fullBeatCount += dt;
  if (fullBeatCount >= FULL_MEASURE) {
    fullBeatCount = fullBeatCount % FULL_MEASURE;
  }

  // Game logic
  diceWall.update(dt);
  bugs.forEach(b => {
    if (!b.isCaught && diceWall.checkCircleCollision(b.position, b.radius)) {
      b.getCaught();
      if (!b.isCaught) diceWall.breakWall(b.position, b.radius);
    }
    b.update(dt);
  });
  comboParticles.forEach(cp => cp.update(dt));
  let cptoRemove = comboParticles.find(cp => cp.isDone);
  if (cptoRemove >= 0) comboParticles.splice(cptoRemove, 1);

  // Play all
  if (R.all(b => (b.isCaught && !b.isPlaying), bugs)) bugs.forEach(b => b.triggerPlay());
  beatButtons.forEach(b => b.update(dt));
}

function mainDraw() {
  grass.forEach(g => g.draw(ctx));
  bugs.forEach(b => b.draw(ctx));
  comboParticles.forEach(cp => cp.draw(ctx));
  diceWall.draw(ctx);
  beatButtons.forEach(b => b.draw(ctx));

  // Draw Timer
  ctx.save();
  ctx.lineWidth = timerSize;
  ctx.strokeStyle = loseTimer > 20 ? 'white' : 'red';
  const timerScale = loseTimer / 120;

  ctx.beginPath();
  ctx.moveTo(VW / 2 - (VW / 2 * timerScale), 0);
  ctx.lineTo(VW / 2 + (VW / 2 * timerScale), 0);
  ctx.moveTo(VW / 2 - (VW / 2 * timerScale), VH);
  ctx.lineTo(VW / 2 + (VW / 2 * timerScale), VH);
  ctx.stroke();

  ctx.restore();
}

let endresetTimer = 10;
function endUpdate(dt) {
  if (colorSwitchTime < 0) {
    const r = Math.random() * 255;
    const g = Math.random() * 255;
    const b = Math.random() * 255;
    endMain.setAttribute('style', `text-shadow: -5px 5px rgba(${r}, ${g}, ${b}, 1)`);
    colorSwitchTime = 0.15;
  }
  colorSwitchTime -= dt;

  endresetTimer += dt;
  if (endresetTimer > 30) location.reload();
}

function endDraw() {

}

let combo1, combo2;
let bugsTrappedLoop = 0;
function update() {
  const currTime = Date.now();
  const dt = (currTime - prevTime) / 1000;
  prevTime = currTime;

  // Mechamarkers needs to be updated every frame
  Mechamarkers.update(currTime);

  switch(gameState) {
    case 'START':
      startUpdate(dt);
      break;
    case 'MAIN':
      mainUpdate(dt);
      break;
    case 'END':
      endUpdate(dt);
      break;
    default: break;
  }
  
  draw();
  window.requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(-1, -1, canvas.width + 1, canvas.height + 1);

  switch(gameState) {
    case 'START':
      startDraw();
      break;
    case 'MAIN':
      mainDraw();
      break;
    case 'END':
      endDraw();
      break;
    default: break;
  }
}

function clickBeat(p) {
  bugs.forEach(b => {
    if (p.dist(b.position) < 45) {
      b.clickBeat();
    }
  });
}

window.onload = () => {
  prevTime = Date.now();
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  Mechamarkers.init(canvas, ctx);

  TrackManager.init();
  ImgManager.init();

  beatButtons.push(new BeatButton('button_0', clickBeat, new Vec2(0, 0)));

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  titleMain = document.querySelector('.title-main');

  // Mouse debug stuff

  canvas.addEventListener('mousedown', (e) => {
    clickBeat(new Vec2(e.clientX, e.clientY));
    debugStart = true;
  });
  // canvas.addEventListener('mouseup', () => isBeatButtonDown = false);
  // canvas.addEventListener('mousemove', (e) => beatButtonPos.set(e.clientX, e.clientY));

  preload();
}