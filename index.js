import Vec2 from './src/Utils/Vec2';

import * as Mechamarkers from './src/Mechamarkers';
import * as TrackManager from './src/TrackManager';
import * as ImgManager from './src/ImgManager';
import DJBoard from './src/Actors/DJBoard';
import Disc from './src/Actors/Disc';
import Dancer from './src/Actors/Dancer';
import Light from './src/Actors/Light';

let canvas, ctx, prevTime;

const VW = window.innerWidth;
const VH = window.innerHeight;

let DJ1Board, DJ2Board;
const discs = [];
const dancers = [];
const lights = [];

let quarterBeatCount = 0;
let halfBeatCount = 0;
let fullBeatCount = 0;
let QUARTER_MEASURE = 60 / 120
let HALF_MEASURE = 60 / 60;
let FULL_MEASURE = 60 / 30;

function preload() {
  if (!TrackManager.checkLoaded()) {
    window.requestAnimationFrame(preload);
  } else {
    TrackManager.startTracks();
    // add dancer
    const spawnDancer = (x, y) => {
      const assetID = Math.round(Math.random() * 3);
      dancers.push(new Dancer(new Vec2(x, y), assetID));
      dancers.sort((d1, d2) => d1.position.y-d2.position.y);
    };
    // init dj boards
    DJ1Board = new DJBoard(new Vec2(0, 0), 'LEFT', spawnDancer);
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * (VW - VW / 4) + VW / 8;
      const y = Math.random() * (VH - 300);
      spawnDancer(x, y);
    }
    lights.push(new Light(new Vec2(VW /2, VH *0.8), 3.14));

    // Init and push all sounds to sound array
    discs.push(new Disc(0, 'acid-house', 0), new Disc(1, 'acid-house', 1), new Disc(2, 'acid-house', 2));

    window.requestAnimationFrame(update);
  }
}

function update() {
  const currTime = Date.now();
  const dt = (currTime - prevTime) / 1000;
  prevTime = currTime;

  discs.forEach(d => {
    d.inUse = (DJ1Board.checkDiscSlotted(d));// || DJ2Board.checkDiscSlotted(d));
    d.update(dt);
  });
  DJ1Board.update(dt);
  // DJ2Board.update(dt);

  // Beat timers
  quarterBeatCount += dt;
  if (quarterBeatCount >= QUARTER_MEASURE) {
    quarterBeatCount = quarterBeatCount % QUARTER_MEASURE;
    discs.forEach(d => d.pulse());
    dancers.forEach(d => d.flip());
    discs.forEach(d => d.rotate());
  }

  halfBeatCount += dt;
  if (halfBeatCount >= HALF_MEASURE) {
    halfBeatCount = halfBeatCount % HALF_MEASURE;
  }

  fullBeatCount += dt;
  if (fullBeatCount >= FULL_MEASURE) {
    fullBeatCount = fullBeatCount % FULL_MEASURE;
  }

  // Mechamarkers stuff
  Mechamarkers.update(currTime);
  // Switch Gate
  const toggle = Mechamarkers.getGroup('track-toggle');
  // console.log(toggle.isPresent());
  const grabber = Mechamarkers.getGroup('track-grabber');

  // Switch logic
  // if (toggle && toggle.isPresent()) {
  //   const togglePoint = Vec2.copy(Mechamarkers.mapPointToCanvas(toggle.pos, window.innerWidth, window.innerHeight));
  // }

  // if (grabber && grabber.isPresent()) {
  //   const grabPoint = Vec2.copy(Mechamarkers.mapPointToCanvas(grabber.pos, window.innerWidth, window.innerHeight));
  // }

  draw();
  window.requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(-1, -1, canvas.width + 1, canvas.height + 1);

  dancers.forEach(d => d.draw(ctx));
  lights.forEach(d => d.draw(ctx));
  DJ1Board.draw(ctx);
  discs.forEach(d => d.draw(ctx));

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
  TrackManager.init();
  ImgManager.init();

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  preload();
}