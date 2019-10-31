const images = {};

export function init() {
  // load them images
  images.dancers = [];
  const disco_m = new Image();
  disco_m.src = './assets/dancers/fro_glow_white.png';
  const disco_f = new Image();
  disco_f.src = './assets/dancers/dance_glow_white.png';
  const hat_m = new Image();
  hat_m.src = './assets/dancers/bro_glow_white.png';
  const ballet_f = new Image();
  ballet_f.src = './assets/dancers/ballet_glow_white.png';

  images.dancers.push(disco_m);
  images.dancers.push(disco_f);
  images.dancers.push(hat_m);
  images.dancers.push(ballet_f);

  // lights
  images.lights = [];
  const blue = new Image();
  blue.src = './assets/lights/Music_Light_Blue.png';
  images.lights.push(blue);
}

export function drawDancer(ctx, key, x, y, size) {
  const asset = images.dancers[key];
  const ratio = size / asset.width;
  ctx.drawImage(asset, x, y, asset.width * ratio, asset.height * ratio);
}

export function drawLight(ctx, key, x, y, rot) {
  const asset = images.lights[key];
  const ratio = 300 / asset.width;
  ctx.drawImage(asset, x, y, asset.width * ratio, asset.height * ratio);
}