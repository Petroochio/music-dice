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
const QUADS_CALIBRATED = [[{"x":0.1094789356984479,"y":0.15763546798029557},{"x":0.11730177059276367,"y":0.3313376667807048},{"x":0.1323133179368745,"y":0.4976052001368457},{"x":0.1505966127790608,"y":0.6476223058501539},{"x":0.17224788298691301,"y":0.7815600410537119},{"x":0.19412518301610543,"y":0.8955157556489133}],[{"x":0.17176674364896075,"y":0.13889839206294902},{"x":0.17946497305619707,"y":0.3226137529934998},{"x":0.19255196304849884,"y":0.4982894286691755},{"x":0.2096805234795997,"y":0.6558330482381115},{"x":0.22892609699769054,"y":0.7931919261033185},{"x":0.24865280985373364,"y":0.9095107765993842}],[{"x":0.24470746728252502,"y":0.12076633595620938},{"x":0.2506735950731332,"y":0.31440301060554227},{"x":0.26164357197844496,"y":0.4979473144030106},{"x":0.27627020785219397,"y":0.6619911050290798},{"x":0.2920515781370285,"y":0.8037974683544303},{"x":0.3085065434949962,"y":0.9225111187136503}],[{"x":0.3279445727482679,"y":0.10639753677728361},{"x":0.33208237105465743,"y":0.30773178241532667},{"x":0.3401655119322556,"y":0.49811837153609306},{"x":0.3503656658968437,"y":0.6672938761546358},{"x":0.3617205542725173,"y":0.8118371536093055},{"x":0.3734603541185527,"y":0.9319192610331851}],[{"x":0.4197459584295612,"y":0.09681833732466644},{"x":0.4217667436489607,"y":0.30328429695518305},{"x":0.42542340261739797,"y":0.49846048580225794},{"x":0.4306197074672825,"y":0.6707150188162846},{"x":0.4365858352578907,"y":0.8176530961341087},{"x":0.4423595073133179,"y":0.9380773178241533}],[{"x":0.5164549653579676,"y":0.09339719466301745},{"x":0.5153002309468823,"y":0.30208689702360586},{"x":0.5147228637413395,"y":0.49914471433458774},{"x":0.5141454965357968,"y":0.6719124187478618},{"x":0.5139530408006159,"y":0.8190215531987683},{"x":0.5133756735950732,"y":0.9399589462880602}],[{"x":0.6122016936104696,"y":0.09852890865549094},{"x":0.6088337182448038,"y":0.30482381115292506},{"x":0.6038298691301001,"y":0.49914471433458774},{"x":0.597671285604311,"y":0.6705439616832022},{"x":0.5903579676674365,"y":0.8166267533356141},{"x":0.5841993841416474,"y":0.9379062606910709}],[{"x":0.7030408006158584,"y":0.1087923366404379},{"x":0.6974595842956121,"y":0.3092712966130688},{"x":0.6880292532717475,"y":0.4993157714676702},{"x":0.6770592763664357,"y":0.667464933287718},{"x":0.6645496535796767,"y":0.8114950393431406},{"x":0.6524249422632794,"y":0.9315771467670202}],[{"x":0.7847382602001539,"y":0.12521382141635307},{"x":0.7772324865280985,"y":0.31696886760177895},{"x":0.7651077752117014,"y":0.4993157714676702},{"x":0.7502886836027713,"y":0.6619911050290798},{"x":0.733256351039261,"y":0.8026000684228533},{"x":0.7167051578137028,"y":0.9202873759835786}],[{"x":0.8561393379522709,"y":0.14334587752309272},{"x":0.8470939183987682,"y":0.32586383852206635},{"x":0.832852193995381,"y":0.4989736572015053},{"x":0.8153387220939184,"y":0.6554909339719466},{"x":0.7956120092378753,"y":0.7919945261717414},{"x":0.7754041570438799,"y":0.9083133766678071}],[{"x":0.9167628945342571,"y":0.16113581936366747},{"x":0.9075250192455735,"y":0.3344166951761888},{"x":0.8923210161662818,"y":0.4989736572015053},{"x":0.8734603541185527,"y":0.6479644201163187},{"x":0.851039260969977,"y":0.7805336982552172},{"x":0.8294842186297152,"y":0.8934314060896339}]];
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
