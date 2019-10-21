import { vecSub, vecMag, vecMag2, vecDot } from '../Vec2';

// normalized based on image height

// const IMGW = 960;
// const IMGH = 540;

// const IMGW = 1120;
// const IMGH = 630;

const IMGW = 1280;
const IMGH = 720;

// const IMGW = 1920;
// const IMGH = 1080;

// paste calibration data into QUADS_CALIBRATED and CELLS_CALIBRATED
const QUADS_CALIBRATED = [[{"x":0.11039260969976905,"y":0.1568144499178982},{"x":0.1174364896073903,"y":0.3310755336617406},{"x":0.13267898383371823,"y":0.4975369458128079},{"x":0.15115473441108546,"y":0.6477832512315271},{"x":0.17286374133949192,"y":0.7811986863711001},{"x":0.19412518301610543,"y":0.8955157556489133}],[{"x":0.17193995381062355,"y":0.1383415435139573},{"x":0.17956120092378752,"y":0.32245484400656815},{"x":0.19249422632794458,"y":0.49794745484400654},{"x":0.20981524249422634,"y":0.6555829228243021},{"x":0.2287528868360277,"y":0.7935139573070608},{"x":0.2484988452655889,"y":0.9098932676518884}],[{"x":0.24515011547344112,"y":0.12110016420361248},{"x":0.25057736720554274,"y":0.31403940886699505},{"x":0.26189376443418017,"y":0.4977422003284072},{"x":0.2762124711316397,"y":0.6615353037766831},{"x":0.2921478060046189,"y":0.8039819376026273},{"x":0.3081986143187067,"y":0.9222085385878489}],[{"x":0.32806004618937645,"y":0.10632183908045977},{"x":0.3323325635103926,"y":0.3074712643678161},{"x":0.34041570438799074,"y":0.4981527093596059},{"x":0.35011547344110855,"y":0.6676929392446633},{"x":0.36200923787528866,"y":0.8121921182266011},{"x":0.373094688221709,"y":0.9316502463054187}],[{"x":0.4199769053117783,"y":0.09688013136288999},{"x":0.42159353348729794,"y":0.3031609195402299},{"x":0.4252886836027714,"y":0.4987684729064039},{"x":0.43060046189376444,"y":0.6705665024630542},{"x":0.437066974595843,"y":0.8173234811165846},{"x":0.44214780600461895,"y":0.9373973727422004}],[{"x":0.5162817551963048,"y":0.09400656814449918},{"x":0.515473441108545,"y":0.3019293924466338},{"x":0.5150115473441108,"y":0.4989737274220033},{"x":0.5143187066974596,"y":0.6713875205254516},{"x":0.5136258660508083,"y":0.8191707717569786},{"x":0.5133949191685913,"y":0.9398604269293924}],[{"x":0.6120092378752887,"y":0.0989326765188834},{"x":0.6087759815242494,"y":0.3048029556650246},{"x":0.6036951501154735,"y":0.4989737274220033},{"x":0.597459584295612,"y":0.6709770114942529},{"x":0.5905311778290993,"y":0.8169129720853858},{"x":0.5840646651270208,"y":0.937807881773399}],[{"x":0.7027713625866054,"y":0.10919540229885058},{"x":0.6974595842956121,"y":0.30972906403940886},{"x":0.6882217090069284,"y":0.49938423645320196},{"x":0.6766743648960739,"y":0.6674876847290641},{"x":0.6646651270207852,"y":0.8113711001642037},{"x":0.6521939953810624,"y":0.93123973727422}],[{"x":0.7844110854503464,"y":0.12520525451559936},{"x":0.7775981524249422,"y":0.3171182266009852},{"x":0.7651270207852194,"y":0.4989737274220033},{"x":0.75,"y":0.6619458128078818},{"x":0.7337182448036952,"y":0.8029556650246307},{"x":0.7166281755196305,"y":0.9209770114942529}],[{"x":0.8556581986143187,"y":0.14367816091954022},{"x":0.8471131639722864,"y":0.3261494252873563},{"x":0.833256351039261,"y":0.4989737274220033},{"x":0.8153579676674365,"y":0.6557881773399015},{"x":0.7956120092378753,"y":0.7922824302134647},{"x":0.7757505773672054,"y":0.9076354679802956}],[{"x":0.9166281755196305,"y":0.16338259441707717},{"x":0.9069284064665127,"y":0.33435960591133007},{"x":0.892147806004619,"y":0.4985632183908046},{"x":0.8735565819861432,"y":0.6479885057471264},{"x":0.8517321016166282,"y":0.7799671592775042},{"x":0.8295612009237875,"y":0.8932676518883416}]];
const CELLS_CALIBRATED = [[{"x":0,"y":1},{"x":0,"y":0.8},{"x":0,"y":0.6000000000000001},{"x":0,"y":0.4},{"x":0,"y":0.2},{"x":0,"y":0}],[{"x":0.1,"y":1},{"x":0.1,"y":0.8},{"x":0.1,"y":0.6000000000000001},{"x":0.1,"y":0.4},{"x":0.1,"y":0.2},{"x":0.1,"y":0}],[{"x":0.2,"y":1},{"x":0.2,"y":0.8},{"x":0.2,"y":0.6000000000000001},{"x":0.2,"y":0.4},{"x":0.2,"y":0.2},{"x":0.2,"y":0}],[{"x":0.30000000000000004,"y":1},{"x":0.30000000000000004,"y":0.8},{"x":0.30000000000000004,"y":0.6000000000000001},{"x":0.30000000000000004,"y":0.4},{"x":0.30000000000000004,"y":0.2},{"x":0.30000000000000004,"y":0}],[{"x":0.4,"y":1},{"x":0.4,"y":0.8},{"x":0.4,"y":0.6000000000000001},{"x":0.4,"y":0.4},{"x":0.4,"y":0.2},{"x":0.4,"y":0}],[{"x":0.5,"y":1},{"x":0.5,"y":0.8},{"x":0.5,"y":0.6000000000000001},{"x":0.5,"y":0.4},{"x":0.5,"y":0.2},{"x":0.5,"y":0}],[{"x":0.6000000000000001,"y":1},{"x":0.6000000000000001,"y":0.8},{"x":0.6000000000000001,"y":0.6000000000000001},{"x":0.6000000000000001,"y":0.4},{"x":0.6000000000000001,"y":0.2},{"x":0.6000000000000001,"y":0}],[{"x":0.7000000000000001,"y":1},{"x":0.7000000000000001,"y":0.8},{"x":0.7000000000000001,"y":0.6000000000000001},{"x":0.7000000000000001,"y":0.4},{"x":0.7000000000000001,"y":0.2},{"x":0.7000000000000001,"y":0}],[{"x":0.8,"y":1},{"x":0.8,"y":0.8},{"x":0.8,"y":0.6000000000000001},{"x":0.8,"y":0.4},{"x":0.8,"y":0.2},{"x":0.8,"y":0}],[{"x":0.9,"y":1},{"x":0.9,"y":0.8},{"x":0.9,"y":0.6000000000000001},{"x":0.9,"y":0.4},{"x":0.9,"y":0.2},{"x":0.9,"y":0}],[{"x":1,"y":1},{"x":1,"y":0.8},{"x":1,"y":0.6000000000000001},{"x":1,"y":0.4},{"x":1,"y":0.2},{"x":1,"y":0}]];

const QUADSNORM = generateQuads(QUADS_CALIBRATED);

const QUADS = QUADSNORM.map(
  subset => subset.map(
    q => ({
      x: q.x * IMGW,
      y: q.y * IMGH,
    })
  )
);

const CELLS = generateQuads(CELLS_CALIBRATED);

const CELLS_SIMPLE = CELLS.map(c => ({
  corner: c[0],
  w: c[2].x - c[0].x,
  h: c[2].y - c[0].y,
}));

function generateQuads(q) {
  var a0 = shiftArray2D(q, -1, -1);
  var a1 = shiftArray2D(q, 1, -1);
  var a2 = shiftArray2D(q, 1, 1);
  var a3 = shiftArray2D(q, -1, 1);
  var quadArr = [];
  for (var i=0; i<a0.length; i++) {
    for (var j=0; j<a0[i].length; j++) {
      var temparr = [];
      temparr.push(a0[i][j]);
      temparr.push(a1[i][j]);
      temparr.push(a2[i][j]);
      temparr.push(a3[i][j]);
      quadArr.push(temparr);
    }
  }
  return quadArr;
}

function shiftArray(arr, index) {
  var newarr = [];
  if (index > 0) {
    for (var i=index; i<arr.length; i++) {
      newarr.push(arr[i]);
    }
  } else if (index < 0) {
    for (var i=0; i<arr.length+index; i++) {
      newarr.push(arr[i]);
    }
  }
  return newarr;
}

function shiftArray2D(arr, index1, index2) {
  var newarr = arr.map( a => shiftArray(a, index2));
  newarr = shiftArray(newarr, index1);
  return newarr;
}


// edge length from right angle triangle
function lenFromRATri(hyp, len) {
  return Math.pow(Math.pow(hyp, 2) - Math.pow(len, 2), 0.5);
}

// Line closest point
function lineCP(sP, eP, pt) {
  var sToPt = vecSub(sP, pt);
  var sToE = vecSub(sP, eP);
  var magSE = vecMag2(sToE);
  var t = vecDot(sToPt, sToE) / magSE;
  return {x: sP.x + sToE.x*t, y: sP.y + sToE.y*t};
}

// memoize this
function areaTriangle(p0, p1, p2) {
  return Math.abs(p0.x*(p1.y - p2.y) + p1.x*(p2.y - p0.y) + p2.x*(p0.y - p1.y))/2
}
// End Vector lib

function ptInQuad(pt, quadArr) {
  var quadArea = areaTriangle(quadArr[0], quadArr[1], quadArr[2]) + areaTriangle(quadArr[0], quadArr[2], quadArr[3]);
  var ptArea = 0;
  for (var i=0; i<quadArr.length; i++) {
      ptArea = ptArea + areaTriangle(pt, quadArr[i], quadArr[(i+1)%quadArr.length]);
  }
  var ratio = ptArea / quadArea;
  if (ratio <= 1.0001) {
      return true;
  } else {
      return false;
  }
}

const xaxis = {x:1, y:0};
const yaxis = {x:0, y:1};
const xaxisNeg = {x:-1, y:0};
const yaxisNeg = {x:0, y:-1};

function mapQuad(pt, quadArr) {
  // https://math.stackexchange.com/questions/13404/mapping-irregular-quadrilateral-to-a-rectangle
  const p0 = quadArr[0];
  const p1 = quadArr[1];
  const p2 = quadArr[2];
  const p3 = quadArr[3];
  const dU0 = vecMag(vecSub(lineCP(p0, p3, pt), pt));
  const dU1 = vecMag(vecSub(lineCP(p1, p2, pt), pt));
  const u = dU0 / (dU0 + dU1);
  const dV0 = vecMag(vecSub(lineCP(p0, p1, pt), pt));
  const dV1 = vecMag(vecSub(lineCP(p3, p2, pt), pt));
  const v = dV0 / (dV0 + dV1);

  return {u:u, v:v};
}

export function mapPointToUV(pt) {
  const quadindex = QUADS.findIndex(q => ptInQuad(pt, q));
  const quad = QUADS[quadindex];

  if (quad) {
    return {
      uv: mapQuad(pt, quad),
      uvindex: quadindex,
    };
  }
  // console.warn('Cannot find quad for given point in: mapPointToUV') // PETER CODE LAGS AROUND HERE
  // Probs should throw error
  return undefined;
}

export function mapUVtoCellCoord(pt) {
  // Bail if point is undefined
  if (!pt) return { x: -1, y: -1 };

  const cell = CELLS_SIMPLE[pt.uvindex];

  return {
    x: cell.corner.x + (pt.uv.u * cell.w),
    y: cell.corner.y + (pt.uv.v * cell.h),
  };
}
