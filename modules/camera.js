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

  inside(point, vs, start, end) { // point = Vertex2D; vs = Polygon2D vertices
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    var x = point.x, y = point.y;

    let cs = vs.filter(item => {return item.equals(start);}).length > 0;
    let ce = vs.filter(item => {return item.equals(end);}).length > 0;

    if (cs && ce) return true;

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
  insidePoly(point, poly) {
    let x = point.x, y = point.y;

    let cornersX = poly.vertices.map(item => item.x);
    let cornersY = poly.vertices.map(item => item.y);

    var i, j=cornersX.length-1 ;
    var odd = false;

    var pX = cornersX;
    var pY = cornersY;

    for (i=0; i<cornersX.length; i++) {
        if ((pY[i]< y && pY[j]>=y ||  pY[j]< y && pY[i]>=y)
            && (pX[i]<=x || pX[j]<=x)) {
              odd ^= (pX[i] + (y-pY[i])*(pX[j]-pX[i])/(pY[j]-pY[i])) < x;
        }

        j=i;
    }

    return odd;
  }
  overlapping(poly1, poly2) { // poly1 = poly2 = Polygon2D
    for (let i = 0; i < poly1.vertices.length; i++) {
      if (this.inside(poly1.vertices[i]), poly2) { return true; }
      if (this.inside(poly2.vertices[i]), poly1) { return true; }
    }
    return false;
  }

  faculty(num) {
    let res = num;
    for (let i = 1; i < num; i++) {
      res *= num - i;
    }
    return res;
  }

  intersect(v1, v2) {
    let x1 = v1.start.x;
    let x2 = v1.end.x;
    let y1 = v1.start.y;
    let y2 = v1.end.y;
    let x3 = v2.start.x;
    let x4 = v2.end.x;
    let y3 = v2.start.y;
    let y4 = v2.end.y;

    // Check if none of the lines are of length 0
  	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
  		return false
  	}

  	let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    // Lines are parallel
  	if (denominator === 0) {
  		return false
  	}

  	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
  	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // is the intersection along the segments
  	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
  		return false
  	}


    // Return a object with the x and y coordinates of the intersection
  	let x = x1 + ua * (x2 - x1);
  	let y = y1 + ua * (y2 - y1);
    let v = new Vertex2D(x, y);

    // is the intersection on one woth the start vertices
    if (v.equals(v1.start) || v.equals(v1.end) || v.equals(v2.start) || v.equals(v2.end)) {
      return false;
    }

  	return {v: v}
  }
  lineIntersection(vector1, vector2, includeLineVertices) { // original by paul bourke
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

    let v = new Vertex2D(x1 + ua * (x2 - x1), y1 + ua * (y2 - y1));let p = v;
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

    if (p.equals(vector1.start) || p.equals(vector1.end) || p.equals(vector2.start) || p.equals(vector2.end)) if (!includeLineVertices) return null;

    if (!onLine(p, vector1) || !onLine(p, vector2)) return null;

  	return {v: p};
    /*return {
      v: v,
      x: x1 + ua * (x2 - x1),
      y: y1 + ua * (y2 - y1),
      seg1: ua >= 0 && ua <= 1,
      seg2: ub >= 0 && ub <= 1
    }*/
  }

  calculateIntersection(v1, v2, includeLineVertices) {
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

    if (p.equals(v1.start) || p.equals(v1.end) || p.equals(v2.start) || p.equals(v2.end)) if (!includeLineVertices) return null;

    if (!onLine(p, v1) || !onLine(p, v2)) return null;

  	return {v: p};
  }

  combinate(arr) {
    let res = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i; j < arr.length; j++) {
        if (j != i) {
          res.push([arr[i], arr[j]]);
        }
      }
    }
    return res;
  }
  removeDuplicates(arr) {
    let res = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr.filter((item, pos) => {return item.equals(arr[i]) && pos != i}).length == 0) {
        res.push(arr[i]);
      }
    }
    return res;
  }
  pointModelIntersections(lines) { // lines = [ProjectedLine]
    let vertices = [];
    let inLines = [];
    let combinations = this.combinate(lines);
    console.log(combinations);
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
    for (let i = 0; i < combinations.length; i++) {
      if (combinations[i][0] != combinations[i][1]) {
        let lineVector1 = new Vector2D(combinations[i][0].start, combinations[i][0].end);
        let lineVector2 = new Vector2D(combinations[i][1].start, combinations[i][1].end);
        let intersect = this.intersect(lineVector1, lineVector2);//this.lineIntersection(lineVector1, lineVector2);//this.calculateIntersection(lineVector1, lineVector2);
        if (intersect) {
          if (vertices.filter(item => {return item.x == intersect.v.x && item.y == intersect.v.y;}).length == 0) {
            vertices.push(intersect.v);
          }
          let i1 = new IntersectionLine(lineVector1.start, intersect.v, combinations[i][0].originalStart);
          let i2 = new IntersectionLine(lineVector1.end, intersect.v, combinations[i][0].originalEnd);
          let i3 = new IntersectionLine(lineVector2.start, intersect.v, combinations[i][1].originalStart);
          let i4 = new IntersectionLine(lineVector2.end, intersect.v, combinations[i][1].originalEnd);
          inLines.push(i1, i2, i3, i4);
        } else {
          let i1 = new IntersectionLine(lineVector1.start, lineVector1.end, combinations[i][0].originalStart);
          let i2 = new IntersectionLine(lineVector2.start, lineVector2.end, combinations[i][1].originalStart);
          inLines.push(i1, i2);
        }
      }
    }
    // TODO: dupe removal
    //inLines = this.removeDuplicates(inLines, true);
    /*for (let i = 0; i < lines.length; i++) {
      let lineVector1 = new Vector2D(lines[i].start, lines[i].end);
      for (let j = 0; j < lines.length; j++) {
        if (lines[j] != lines[i]) {
          console.log("hji");
          let lineVector2 = new Vector2D(lines[j].start, lines[j].end);
          let intersect = this.calculateIntersection(lineVector1, lineVector2);//this.lineIntersection(lineVector1, lineVector2);
          if (intersect) {
            if (vertices.filter(item => {return item.x == intersect.v.x && item.y == intersect.v.y;}).length == 0) {
              vertices.push(intersect.v);
            }
            let i1 = new IntersectionLine(lineVector1.start, intersect.v, lines[i].originalStart);
            let i2 = new IntersectionLine(lineVector1.end, intersect.v, lines[i].originalEnd);
            let i3 = new IntersectionLine(lineVector2.start, intersect.v, lines[j].originalStart);
            let i4 = new IntersectionLine(lineVector2.end, intersect.v, lines[j].originalEnd);
            inLines.push(i1, i2, i3, i4);
          } else {
            let i1 = new IntersectionLine(lineVector1.start, lineVector1.end, lines[i].originalStart);
            let i2 = new IntersectionLine(lineVector2.start, lineVector2.end, lines[j].originalStart);
            inLines.push(i1, i2);
          }
        }
      }
    }*/
    return [vertices, inLines];
  }

  getFaces(objects) {
    let arr = [];
    for (let i = 0; i < objects.length; i++) {
      for (let j = 0; j < objects[i].faces.length; j++) {
        arr.push(objects[i].faces[j]);
      }
    }
    return arr;
  }

  toPolygon(faces) {
    let arr = [];
    for (let i = 0; i < faces.length; i++) {
      arr.push(new Polygon2D(faces[i]));
    }
    return arr;
  }

  hiddenLineRemoval(interLines, polys) { // interLines == [IntersectionLine]; polys == [ProjectedPolygon]
    let newArr = [];
    interLines.forEach((line, i) => {
      polys.forEach((poly, j) => {
        if (this.inside(line.middle, poly.vertices, line.start, line.end)) {
          if (line.z < poly.face[0].z) {
            //newArr.push(line);
          } else {
            newArr.push(line);
          }
        } else {
          newArr.push(line);
        }
      });
    });
    //newArr = this.removeDuplicates(newArr);
    return newArr;
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
