import pz from 'pizzicato';
import Vec2 from './src/Utils/Vec2';

import * as Mechamarkers from './src/Mechamarkers';
import Wall from './src/Actors/Wall';
import Ball from './src/Actors/Ball';
import Player from './src/Actors/Player';

let canvas, ctx, prevTime;
let loadedSongs = 0;
let triggeredPlay = false;
const walls = [];
walls.push(new Wall(new Vec2(0, 0), new Vec2(window.innerWidth, 0)));
walls.push(new Wall(new Vec2(0, window.innerHeight), new Vec2(window.innerWidth, window.innerHeight)));
walls.push(new Wall(new Vec2(0, 0), new Vec2(0, window.innerHeight)));
walls.push(new Wall(new Vec2(window.innerWidth, 0), new Vec2(window.innerWidth, window.innerHeight)));
const balls = [];
balls.push(new Ball(new Vec2(200, 100), new Vec2(1, 1), 5));
balls.push(new Ball(new Vec2(200, 100), new Vec2(1, -1), 5));
balls.push(new Ball(new Vec2(200, 100), new Vec2(-1, -1), 5));
balls.push(new Ball(new Vec2(200, 100), new Vec2(-1, 1), 5));
balls.push(new Ball(new Vec2(200, 100), new Vec2(-1, 0), 5));
balls.push(new Ball(new Vec2(200, 100), new Vec2(1, 0), 5));
balls.push(new Ball(new Vec2(200, 100), new Vec2(0, -1), 5));
balls.push(new Ball(new Vec2(200, 100), new Vec2(0, 1), 5));

const players = [];

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
  const dt = (currTime - prevTime) / 1000;
  prevTime = currTime;

  // checkCanPlay();

  Mechamarkers.update(currTime);

  players.forEach(p => p.update(dt));

  ctx.clearRect(-1, -1, canvas.width + 1, canvas.height + 1);

  // The Game Stuff so far
  balls.forEach(b => {
    b.update(dt);

    // Check walls for collision
    // Make this predictive somehow, could add line by projecting next position of it crosses
    // Then set position as collision point? or do half step
    walls.forEach(w => {
      if (w.checkCircleCollision(b.position, b.r)) {
        b.setDirection(w.getReflection(b.position, b.forward));
      }
    });

    players.forEach(p => {
      if (p.checkCircleCollision(b.position, b.r)) {
        b.setDirection(p.getReflection(b.position, b.forward));
      }
    });

    b.draw(ctx);
  });

  // Draw de walls
  walls.forEach(w => w.draw(ctx));
  players.forEach(p => p.draw(ctx));

  window.requestAnimationFrame(update);
}

window.onload = () => {
  prevTime = Date.now();
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  Mechamarkers.init(canvas, ctx);

  // Init and push all sounds to sound array
  // Percussion
  markerSoundMap.push([52, new pz.Sound('./audio/Electronic_Beat_1.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([57, new pz.Sound('./audio/Electronic_Beat_2.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([58, new pz.Sound('./audio/Electronic_Beat_3.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([56, new pz.Sound('./audio/Conga_Beat_1.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([51, new pz.Sound('./audio/Conga_Beat_2.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([59, new pz.Sound('./audio/Kit_Beat_1.wav', () => loadedSongs += 1)]);

  players.push(new Player([52, 56, 57, 58, 51, 59], [38, 39, 40, 46, 45, 10]));
  players.push(new Player([52, 56, 57, 58, 51, 59], [48, 49, 44, 47, 53, 54]));
  players.push(new Player([38, 39, 40, 46, 45, 10], [48, 49, 44, 47, 53, 54]));

  // Marimba
  markerSoundMap.push([38, new pz.Sound('./audio/Marimba_Tune_1.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([39, new pz.Sound('./audio/Marimba_Tune_2.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([40, new pz.Sound('./audio/Marimba_Tune_3.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([46, new pz.Sound('./audio/Marimba_Tune_4.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([45, new pz.Sound('./audio/Marimba_Tune_5.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([10, new pz.Sound('./audio/Marimba_Tune_6.wav', () => loadedSongs += 1)]);

  // Strings
  markerSoundMap.push([48, new pz.Sound('./audio/Strings_Tune_1.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([49, new pz.Sound('./audio/Strings_Tune_2.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([44, new pz.Sound('./audio/Strings_Tune_3.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([47, new pz.Sound('./audio/Strings_Tune_4.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([53, new pz.Sound('./audio/Strings_Tune_5.wav', () => loadedSongs += 1)]);
  markerSoundMap.push([54, new pz.Sound('./audio/Strings_Tune_6.wav', () => loadedSongs += 1)]);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.requestAnimationFrame(update);
}