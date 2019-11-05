import Vec2 from './src/Utils/Vec2';

import * as Mechamarkers from './src/Mechamarkers';
import * as TrackManager from './src/TrackManager';
import * as ImgManager from './src/ImgManager';
import DiceWall from './src/Actors/DiceWall';
import BugHead from './src/Actors/BugHead';

let canvas, ctx, prevTime, diceWall;
let centipede = new BugHead(new Vec2(100, 300));

const VW = window.innerWidth;
const VH = window.innerHeight;

let sixTeenthCount = 0;
let eighthBeatCount = 0;
let quarterBeatCount = 0;
let halfBeatCount = 0;
let fullBeatCount = 0;
let SIXTEENTH_MEASURE = 60 / 480;
let EIGHTH_MEASURE = 60 / 240;
let QUARTER_MEASURE = 60 / 120
let HALF_MEASURE = 60 / 60;
let FULL_MEASURE = 60 / 30;
let loopTime = 0;
let LOOP_MAX = 8;

// beat click logic
let wasBeatButtonDown = false;
let isBeatButtonDown = false;
let beatButtonPos = new Vec2(-10, -10);

function preload() {
  if (!TrackManager.checkLoaded()) {
    window.requestAnimationFrame(preload);
  } else {
    TrackManager.startTracks();
    loopTime = 0;
    diceWall = new DiceWall();

    window.requestAnimationFrame(update);
  }
}

function update() {
  const currTime = Date.now();
  const dt = (currTime - prevTime) / 1000;
  prevTime = currTime;

  // Beat timers
  sixTeenthCount += dt;
  if (sixTeenthCount >= SIXTEENTH_MEASURE) {
    sixTeenthCount = sixTeenthCount % SIXTEENTH_MEASURE;
  }


  eighthBeatCount += dt;
  if (eighthBeatCount >= EIGHTH_MEASURE) {
    eighthBeatCount = eighthBeatCount % EIGHTH_MEASURE;
    centipede.frameUpdate();
  }

  quarterBeatCount += dt;
  if (quarterBeatCount >= QUARTER_MEASURE) {
    quarterBeatCount = quarterBeatCount % QUARTER_MEASURE;
    centipede.beatUpdate();
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
  centipede.update(dt);

  if (!centipede.isCaught && diceWall.canCapture && diceWall.checkCircleCollision(centipede.position, centipede.radius)) {
    centipede.getCaught(); // pass dice combo here
    if (!centipede.isCaught) diceWall.break();
  }

  // Beat Button Logic
  // const beatButton = Mechamarkers.getGroup('beat_button');
  // if (beatButton && beatButton.isPresent()) {
  //   isBeatButtonDown = beatButton.getInput('button').val > 0.5;
  //   const buttonPoint = Vec2.copy(Mechamarkers.mapPointToCanvas(beatButton.pos, window.innerWidth, window.innerHeight));
  //   const center = new Vec2(-43, -10);
  //   center.rotate(-beatButton.angle);
  //   center.add(buttonPoint);
  //   beatButtonPos.copy(center);
  // }

  if (!wasBeatButtonDown && isBeatButtonDown) {
    // do the check
    if (beatButtonPos.dist(centipede.position) < 40) {
      centipede.clickBeat();
    }
  }

  wasBeatButtonDown = isBeatButtonDown;
  draw();
  window.requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(-1, -1, canvas.width + 1, canvas.height + 1);
  centipede.draw(ctx);
  diceWall.draw(ctx);

  // draw mouse
  ctx.save();
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'white';
  ctx.translate(beatButtonPos.x, beatButtonPos.y);
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

window.onload = () => {
  prevTime = Date.now();
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  Mechamarkers.init(canvas, ctx);
  TrackManager.init();
  ImgManager.init();

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Mouse debug stuff
  canvas.addEventListener('mousedown', () => isBeatButtonDown = true);
  canvas.addEventListener('mouseup', () => isBeatButtonDown = false);
  canvas.addEventListener('mousemove', (e) => beatButtonPos.set(e.clientX, e.clientY));

  preload();
}