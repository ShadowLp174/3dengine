class Vertex {
  constructor(x, y, z) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);
    return this;
  }

  equals(v) {return v.x == this.x && v.y == this.y && v.z == this.z}
}
class Vertex2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  equals(v) {return v.x == this.x && v.y == this.y}
}
class Polygon2D {
  constructor(vertices) { // vertices = [Vertex2D, ...]
    this.vertices = vertices;

    return this;
  }
}
class ProjectedPolygon {
  constructor(vertices, face) { // vertices = all projected vertices; face = unprojected face vertices
    this.vertices = vertices;
    this.face = face;

    return this;
  }
}

class Matrix {
  constructor(rows) {
    this.rows = rows;

    return this;
  }

  add(m2) {
    return new Matrix(this.rows.map((row, i) => row.map((value, j) => value + m2.rows[i][j])));
  }
  scale(scalar) {
    return new Matrix(this.rows.map((row, i) => row.map((value, j) => value*scalar)));
  }
}

class Vector {
  constructor(start, end) {
    let x = start.x - end.x;
    let y = start.y - end.y;
    let z = start.z - end.z;
    this.length = Math.sqrt(Math.abs(x + y + z));
    this.matrix = new Matrix([x, y, z]);

    this.start = start;
    this.end = end;

    return this;
  }
}
class Vector2D {
  constructor(start, end) { // Vertex2D
    let x = start.x - end.x;
    let y = start.y - end.y;
    this.start = start;
    this.end = end;

    this.matrix = new Matrix([x, y]);
  }
}

class ProjectedLine {
  constructor(start, end, originalStart, originalEnd) {
    this.start = start;
    this.end = end;
    this.originalStart = originalStart;
    this.originalEnd = originalEnd;
    return this;
  }

  equals(p) {
    return this.start == p.start && this.end == p.end && this.originalStart == p.originalStart && this.originalEnd == p.originalEnd;
  }
}
class IntersectionLine {
  constructor(start, end, originalStart) {
    this.start = start;
    this.end = end;
    this.originalStart = originalStart;

    let dx = this.start.x - this.end.x;
    let dy = this.start.y - this.end.y;
    let h = Math.sqrt(dx*dx + dy*dy);

    h = h/2;
    let alpha = Math.atan(dx/dy);

    let x = Math.abs(Math.sin(alpha)*h);
    let y = Math.abs(Math.cos(alpha)*h);

    if (start.x < end.x) {
      x = end.x - x;
    } else {
      x = start.x - x;
    }
    if (start.y < end.y) {
      y = end.y - y;
    } else {
      y = start.y - y;
    }

    let middle = new Vertex2D(x, y);
    this.middle = middle;

    this.z = originalStart.z;
    this.x = originalStart.x;
    return this;
  }

  equals(line) {return line.start.equals(this.start) && line.end.equals(this.end) && line.originalStart.equals(this.originalStart)}
}

/*
@param {HTMLElement}; Must be a HTML Canvas Element; Optional
*/

class Renderer {
  constructor(width, height, element) {
    if (element) {
      this.ctx = element.getContext("2d");
      this.display = element;
      this.existing = true;
    } else {
      this.display = document.createElement('canvas');
      this.ctx = this.display.getContext("2d");
    }
    if (width && height) {
      this.display.width = width;
      this.display.height = height;
    }
    this.activeCam = new Camera();
    return this;
  }

  render(objects, dx, dy) {
    let ctx = this.ctx;
    let canvas = this.display;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // For each object
    for (var i = 0, n_obj = objects.length; i < n_obj; ++i) {
        // For each face
        for (var j = 0, n_faces = objects[i].faces.length; j < n_faces; ++j) {
            // Current face
            var face = objects[i].faces[j];

            // Draw the first vertex
            var P = this.project(face[0]);//this.projectOrthographic(face[0]);
            ctx.beginPath();
            ctx.moveTo(P.x + dx, -P.y + dy);
            //ctx.arc(P.x + dx, -P.y + dy, 2, 0, 2 * Math.PI);

            // Draw the other vertices
            for (var k = 1, n_vertices = face.length; k < n_vertices; ++k) {
                P = this.project(face[k]);//this.projectOrthographic(face[k]);
                ctx.lineTo(P.x + dx, -P.y + dy);
            }

            // Close the path and draw the face
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    }
  }

  renderScene(scene, debugging) {
    let ctx = this.ctx;
    let canvas = this.display;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let vertices = [], lines = [], polys = [];

    for (let i = 0; i < scene.objects.length; i++) {
      let object = scene.objects[i];
      for (let j = 0; j < object.faces.length; j++) {
        var face = object.faces[j];

        ctx.save();
        ctx.beginPath();

        if (object.colors.faces[j]) {
          ctx.fillStyle = object.colors.faces[j];
        }

        var P = scene.camera.project(face[0]);
        ctx.moveTo(P.x, P.y);
        vertices.push(P);
        let ver = [P];

        let last = [P, face[0]];

        for (let k = 1; k < face.length; k++) {
          P = scene.camera.project(face[k]);
          ctx.lineTo(P.x, P.y);
          vertices.push(P);
          lines.push(new ProjectedLine(last[0], P, last[1], face[k]));
          last = [P, face[k]];
          ver.push(P);
        }

        polys[i] = new ProjectedPolygon(ver, face);

        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
      }
    }
    if (debugging) {
      console.log(vertices);
      console.log(lines);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let intersections = scene.camera.pointModelIntersections(lines);

      for (let i = 0; i < intersections[0].length; i++) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.strokeStyle = "green";

        ctx.arc(intersections[0][i].x, intersections[0][i].y, 2, 0, 2 * Math.PI);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      lines.forEach((line) => {
        /*ctx.save();
        ctx.beginPath();

        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(line.end.x, line.end.y);

        ctx.closePath();
        ctx.stroke();
        ctx.restore();*/
      });
      intersections[1].forEach(line => {
        /*ctx.save();
        ctx.beginPath();

        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(line.end.x, line.end.y);

        ctx.closePath();
        ctx.stroke();
        ctx.restore();*/
      });

      console.log("intersections", intersections);

      let arr = scene.camera.hiddenLineRemoval(intersections[1], polys);
      console.log(arr);

      arr.forEach((line, i) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(line.end.x, line.end.y);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(line.middle.x, line.middle.y, 2, 0, 2*Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.restore();
      });

      vertices.forEach(vertex => {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";

        ctx.arc(vertex.x, vertex.y, 1, 0, 2 * Math.PI);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });
    }
  }

  projectOrthographic(M) {
    return new Vertex2D(M.x, M.z);
  }

  getArcPoint(c, r, angle) {
    // C (cos(90-alpha)*r + B.x | sin(90-alpha) * r + B.y)
    angle += 180;
    var point = {
      x: Math.cos(((90+angle) * Math.PI)/180) * r + c.x,
      y: Math.sin(((90+angle) * Math.PI)/180) * r + c.y
    }
    return point;
  }

  project(M) {
	 // Distance between the camera and the plane
	 var d = 200 - this.activeCam.z;
	 var r = d / M.y;

   let x = r * (M.x - this.activeCam.x);
   let z = r * (M.z - this.activeCam.y);

   /*var point = this.getArcPoint({x: 0, y: -d}, Math.sqrt(M.x*M.x + (M.y+d)*(M.y+d)), this.activeCam.rotation)
   var xCorr = Math.sin(this.activeCam.rotation) * Math.sqrt(x*x + (z)*(z));
   console.log(xCorr);
   x += xCorr;*/

	 return new Vertex2D(x, z);
  }

  init(container) {
    if (typeof container == "string") {
      document.querySelector(container).appendChild(this.display);
    } else if (!this.existing) {
      document.body.appendChild(this.display);
    }
  }
}
