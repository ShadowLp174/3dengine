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

class Matrix() {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;

    return this;
  }
}

class Vector() {
  constructor(start, end) {
    let x = start.x - end.x;
    let y = start.y - end.y;
    let z = start.z - end.z;
    this.length = Math.sqrt(x, y, z);

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

  renderScene(scene) {
    let ctx = this.ctx;
    let canvas = this.display;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

        for (let k = 1; k < face.length; k++) {
          P = scene.camera.project(face[k]);
          ctx.lineTo(P.x, P.y);
        }

        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
      }
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
