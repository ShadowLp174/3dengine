class Vertex {
  constructor(x, y, z) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);
    return this;
  }
}
class Vertex2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
}
class Polygon2D {
  constructor(vertices) { // vertices = [Vertex2D, ...]
    this.vertices = vertices;

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

    let vertices = [], lines = [];

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

        let last = [P, face[0]];

        for (let k = 1; k < face.length; k++) {
          P = scene.camera.project(face[k]);
          ctx.lineTo(P.x, P.y);
          vertices.push(P);
          lines.push(new ProjectedLine(last[0], P, last[1], face[k]));
          last = [P, face[k]];
        }

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

      for (let i = 0; i < intersections.length; i++) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.strokeStyle = "green";

        ctx.arc(intersections[i].x, intersections[i].y, 2, 0, 2 * Math.PI);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      console.log("intersections", intersections);


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
