class Camera {
  constructor(scene) {
    this.rotation = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.planeOffset = 200;

    this.scene = scene;

    return this;
  }

  inside(point, vs) { // point = Vertex2D; vs = Polygon2D
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    var x = point.x, y = point.y;

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x, yi = vs[i].y;
        var xj = vs[j].x, yj = vs[j].y;

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
  }
  overlapping(poly1, poly2) { // poly1 = poly2 = Polygon2D
    for (let i = 0; i < poly1.vertices.length; i++) {
      if (this.inside(poly1.vertices[i]), poly2) { return true; }
      if (this.inside(poly2.vertices[i]), poly1) { return true; }
    }
    return false;
  }

  lineIntersection(vector1, vector2) { // original by paul bourke
    let x1 = vector1.start.x; let y1 = vector1.start.y;
    let x2 = vector1.end.x; let y2 = vector1.end.y;
    let x3 = vector2.start.x; let y3 = vector2.start.y;
    let x4 = vector2.end.x; let y4 = vector2.end.y;
    var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;

    let v = new Vertex2D(x1 + ua * (x2 - x1), y1 + ua * (y2 - y1));
    return {
      v: v,
      x: x1 + ua * (x2 - x1),
      y: y1 + ua * (y2 - y1),
      seg1: ua >= 0 && ua <= 1,
      seg2: ub >= 0 && ub <= 1
    }
  }

  calculateIntersection(v1, v2) {
    let p1 = new Vertex2D(v1.start.x, v1.start.y);
    let p2 = new Vertex2D(v1.end.x, v1.end.y);
    let p3 = new Vertex2D(v2.start.x, v2.start.y);
    let p4 = new Vertex2D(v2.end.x, v2.end.y);
  	var d1 = (p1.x - p2.x) * (p3.y - p4.y); // (x1 - x2) * (y3 - y4)
  	var d2 = (p1.y - p2.y) * (p3.x - p4.x); // (y1 - y2) * (x3 - x4)
  	var d  = (d1) - (d2);

  	if(d == 0) {
    	return null; // zero or infinity intersections
    }

  	// upper part of intersection point formula
  	var u1 = (p1.x * p2.y - p1.y * p2.x); // (x1 * y2 - y1 * x2)
  	var u4 = (p3.x * p4.y - p3.y * p4.x); // (x3 * y4 - y3 * x4)

  	var u2x = p3.x - p4.x; // (x3 - x4)
  	var u3x = p1.x - p2.x; // (x1 - x2)
  	var u2y = p3.y - p4.y; // (y3 - y4)
  	var u3y = p1.y - p2.y; // (y1 - y2)

  	// intersection point formula

  	var px = (u1 * u2x - u3x * u4) / d;
  	var py = (u1 * u2y - u3y * u4) / d;

    function distance(p1, p2) {
      let a = p1.x - p2.x;
      let b = p1.y - p2.y;
      let c = Math.sqrt(a*a + b*b);
      return c;
    }



    function onLine(vertex, vector) {
      if (distance(vertex, vector.start) + distance(vertex, vector.end) == distance(vector.start, vector.end))
        return true;
      return false;
    }

    var p = new Vertex2D(px, py);

    if (!onLine(p, v1) || !onLine(p, v2)) return null;

  	return {v: p};
  }

  /*
  projectedLines: [
    Vector {
      start: Vertex2D,
      end: Vertex2D
    }
  ]
  */
  pointModelIntersections(lines) { // lines = [ProjectedLine]
    let vertices = [];
    for (let i = 0; i < lines.length; i++) {
      let lineVector1 = new Vector2D(lines[i].start, lines[i].end);
      for (let j = 0; j < lines.length; j++) {
        if (lines[j] != lines[i]) {
          let lineVector2 = new Vector2D(lines[j].start, lines[j].end);
          let intersect = this.calculateIntersection(lineVector1, lineVector2);//this.lineIntersection(lineVector1, lineVector2);
          if (intersect) {
            if (vertices.filter(item => {return item.x == intersect.v.x && item.y == intersect.v.y;}).length == 0) {
              vertices.push(intersect.v);
            }
          }
        }
      }
    }
    return vertices;
  }

  hiddenLineRemoval(scene, projectedLines) { // TODO
    for (let i = 0; i < projectedLines.length; i++) {

    }
  }

  project(vertex) {
    vertex.x *= 10;
    vertex.y *= 10;
    vertex.z *= 10;

    let distance = (this.planeOffset+vertex.z);

    let x = (vertex.x*this.planeOffset)/distance;
    let y = (vertex.y*this.planeOffset)/distance;

    x += this.scene.width / 2;
    y = -y + this.scene.height / 2;

    vertex.x /= 10;
    vertex.y /= 10;
    vertex.z /= 10;

    return new Vertex2D(x, y);
  }
}
