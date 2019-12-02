import Vec2 from '../Utils/Vec2';
import * as Mechamarkers from '../Mechamarkers';

class DiceWall {
  constructor() {
    this.posts = [
      { marker: Mechamarkers.getMarker(51), mappedPos: new Vec2(400, 100), present: true, wasPresent: true, broken: false },
      { marker: Mechamarkers.getMarker(52), mappedPos: new Vec2(600, 300), present: true, wasPresent: true, broken: false },
      { marker: Mechamarkers.getMarker(53), mappedPos: new Vec2(300, 600), present: true, wasPresent: true, broken: false },
    ];

    this.captureLine = [];
    for (let i = 0; i < 200; i ++) {
      this.captureLine.push(new Vec2(0, 0));
    }

    this.canCapture = false;
  }

  update(dt) {
    // Update posts
    this.posts.forEach((post) => {
      if (post.broken) {
        post.broken = post.wasPresent;
      }

      post.wasPresent = post.present;
      post.present = true; // post.marker.present
      // post.mappedPos.copy(Mechamarkers.mapPointToCanvas(post.marker, window.innerWidth, window.innerHeight));
    });
  }

  beatUpdate() {
    // Bump line width
  }

  drawCaptureLine(ctx, p1, p2) {
    const STEP = 20;
    const line = Vec2.sub(p1, p2);
    const numPoints = Math.round(line.mag() / STEP);
    const lineNorm = line.clone().normalize();
    const perp = line.perp().normalize();
    const perpProxy = new Vec2(perp.x, perp.y);
    const pointProxy = new Vec2(0, 0);

    ctx.save();

    ctx.translate(p1.x, p1.y);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 1; i < numPoints; i++) {
      perpProxy.copy(perp).scale((Math.random() * 14) - 7);
      pointProxy.set(0, 0)
        .add(lineNorm)
        .scale(i * 20)
        .add(perpProxy);
      ctx.lineTo(pointProxy.x, pointProxy.y);
    }
    ctx.lineTo(line.x, line.y);

    ctx.stroke();
    ctx.restore();
  }

  draw(ctx) {
    // const post0 = Mechamarkers.mapPointToCanvas(this.posts[0].marker, window.innerWidth, window.innerHeight)
    // const post1 = Mechamarkers.mapPointToCanvas(this.posts[1].marker, window.innerWidth, window.innerHeight)
    // const post2 = Mechamarkers.mapPointToCanvas(this.posts[2].marker, window.innerWidth, window.innerHeight)
    const post0 = this.posts[0].mappedPos;
    const post1 = this.posts[1].mappedPos;
    const post2 = this.posts[2].mappedPos;
    
    if (this.posts[0].present && this.posts[1].present && (!this.posts[0].broken || !this.posts[1].broken)) {
      this.drawCaptureLine(ctx, post0, post1);
    }

    if (this.posts[1].present && this.posts[2].present && (!this.posts[1].broken || !this.posts[2].broken)) {
      this.drawCaptureLine(ctx, post1, post2);
    }

    if (this.posts[2].present && this.posts[0].present && (!this.posts[2].broken || !this.posts[0].broken)) {
      this.drawCaptureLine(ctx, post2, post0);
    }
  }

  breakWall(p, r) {
    const post0 = this.posts[0].mappedPos;
    const post1 = this.posts[1].mappedPos;
    const post2 = this.posts[2].mappedPos;
    if (this.posts[0].present && this.posts[1].present && (!this.posts[0].broken || !this.posts[1].broken)) {
      if (this.circleCollision(p, r, post0, post1)) {
        this.posts[0].broken = true;
        this.posts[1].broken = true;
      }
    }

    if (this.posts[1].present && this.posts[2].present && (!this.posts[1].broken || !this.posts[2].broken)) {
      if (this.circleCollision(p, r, post1, post2)) {
        this.posts[1].broken = true;
        this.posts[2].broken = true;
      }
    }

    if (this.posts[2].present && this.posts[0].present && (!this.posts[2].broken || !this.posts[0].broken)) {
      if (this.circleCollision(p, r, post2, post0)) {
        this.posts[2].broken = true;
        this.posts[0].broken = true;
      }
    }
  }

  checkCircleCollision(p, r) {
    const post0 = this.posts[0].mappedPos;
    const post1 = this.posts[1].mappedPos;
    const post2 = this.posts[2].mappedPos;

    if (this.posts[0].present && this.posts[1].present && (!this.posts[0].broken || !this.posts[1].broken)) {
      if (this.circleCollision(p, r, post0, post1)) return true;
    }

    if (this.posts[1].present && this.posts[2].present && (!this.posts[1].broken || !this.posts[2].broken)) {
      if (this.circleCollision(p, r, post1, post2)) return true;
    }

    if (this.posts[2].present && this.posts[0].present && (!this.posts[2].broken || !this.posts[0].broken)) {
      if (this.circleCollision(p, r, post2, post0)) return true;
    }
  }

  circleCollision(p, r, start, end) {
    const rSq = r * r;
    const axis = Vec2.sub(start, end);
    const lengthSq = start.dist2(end);

    // Makes sure it's not off the end of the segment
    if (start.dist2(p) < rSq + lengthSq && end.dist2(p) < rSq + lengthSq) {
      // If the circle is close enough to the line to collide
      const circleVec = Vec2.sub(start, p);
      const proj = axis.dot(circleVec) / axis.mag();
      const closestPoint = axis.clone().normalize().scale(proj);

      if (closestPoint.dist2(circleVec) < rSq) return true;
    }

    // Otherwise no
    return false;
  }
}

export default DiceWall;
