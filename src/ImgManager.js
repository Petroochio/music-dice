const images = {};

export function init() {
  // load them images
  images.dancers = [];
  const disco_m = new Image();
  disco_m.src = './assets/dancers/disco_m.png';
  const disco_f = new Image();
  disco_f.src = './assets/dancers/disco_f.png';
  const hat_m = new Image();
  hat_m.src = './assets/dancers/hat_m.png';
  const ballet_f = new Image();
  ballet_f.src = './assets/dancers/ballet_f.png';

  images.dancers.push(disco_m);
  images.dancers.push(disco_f);
  images.dancers.push(hat_m);
  images.dancers.push(ballet_f);
}

export function drawDancer(ctx, key, x, y, size) {
  const asset = images.dancers[key];
  const ratio = size / asset.width;
  ctx.drawImage(asset, x, y, asset.width * ratio, asset.height * ratio);
}