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
const QUADS_CALIBRATED = [[{"x":0.10510614934114203,"y":0.15773034877667882},{"x":0.11447657393850659,"y":0.33263925833357055},{"x":0.12970351390922402,"y":0.49921915668922434},{"x":0.14903001464128843,"y":0.65018222854511},{"x":0.1712847730600293,"y":0.7834461535841521},{"x":0.19412518301610543,"y":0.8955157556489133}],[{"x":0.16630673499267937,"y":0.137948984903696},{"x":0.174798682284041,"y":0.32170745198271167},{"x":0.18885431918008785,"y":0.49817803227485685},{"x":0.20730234260614935,"y":0.656428975031315},{"x":0.2275073206442167,"y":0.794377959935011},{"x":0.2474194729136164,"y":0.909050373035691}],[{"x":0.23834187408491947,"y":0.11868818323789693},{"x":0.24566251830161054,"y":0.31285789446058776},{"x":0.2576683748169839,"y":0.4966163456533056},{"x":0.2734809663250366,"y":0.6616345971031526},{"x":0.29017203513909223,"y":0.8033762449773881},{"x":0.30715593195589885,"y":0.9210233038009175}],[{"x":0.32091874084919475,"y":0.1015096304008329},{"x":0.3264824304538799,"y":0.3034877747312801},{"x":0.3358528572853278,"y":0.4952034183246031},{"x":0.3472730622633659,"y":0.6659478222808759},{"x":0.3601573960847422,"y":0.810143553670777},{"x":0.3724560783687832,"y":0.9298728613230414}],[{"x":0.41228038960983254,"y":0.08953669963560645},{"x":0.4155014730651766,"y":0.29724102030192606},{"x":0.4204795111325265,"y":0.4940135505036846},{"x":0.4272145038118823,"y":0.667360781382174},{"x":0.4345351480285734,"y":0.8141592920353983},{"x":0.4412701407079292,"y":0.9349297241020302}],[{"x":0.5086200764378203,"y":0.08485163977095263},{"x":0.5094985537438231,"y":0.2946382092660073},{"x":0.5100841963448252,"y":0.49245187976843113},{"x":0.5106698478821605,"y":0.6663196569678065},{"x":0.5115483251881634,"y":0.8146798542425819},{"x":0.5124268024941664,"y":0.9359708485163977}],[{"x":0.6052525800981424,"y":0.08745445080687142},{"x":0.6032027997174689,"y":0.2956793336803748},{"x":0.5991032389561219,"y":0.4914107394677658},{"x":0.5944180266574396,"y":0.6647579703462552},{"x":0.5888543370527544,"y":0.8120770432066632},{"x":0.5829978216794015,"y":0.9328474752732951}],[{"x":0.696028550512445,"y":0.09682457053617907},{"x":0.6925146412884334,"y":0.29947200459406315},{"x":0.6843155197657393,"y":0.4903695991671005},{"x":0.6740666178623719,"y":0.6605934726887851},{"x":0.6629392386530014,"y":0.8058303284930537},{"x":0.6515190336749634,"y":0.9257083636655713}],[{"x":0.7785979877515311,"y":0.1119751166407465},{"x":0.7727489019033675,"y":0.30467762666590076},{"x":0.761975065616798,"y":0.48989113530326595},{"x":0.7475658857979502,"y":0.65434672620258},{"x":0.7320461200585652,"y":0.7954190525767829},{"x":0.7165263543191801,"y":0.9146277980218636}],[{"x":0.8509334178829612,"y":0.12909942738157212},{"x":0.8433199478976025,"y":0.31285789446058776},{"x":0.8304356140762262,"y":0.4882873662246633},{"x":0.8137445452621705,"y":0.6465382930948237},{"x":0.7947108702987737,"y":0.784487246225924},{"x":0.7753843695667094,"y":0.9007213777207509}],[{"x":0.9124268293031662,"y":0.1478396668401874},{"x":0.9042277077804722,"y":0.3211868897755279},{"x":0.8904648966530929,"y":0.48672567960311197},{"x":0.8717240474583638,"y":0.6382092977798836},{"x":0.8506405921142935,"y":0.77147319104633},{"x":0.8292643110015556,"y":0.8845839492980544}]];
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
