class Cube {
  constructor(center, size) {
    this.color = {};
    this.colors = {
      faces: []
    }
    this.size = size;
    this.center = center;
    this.horizontalRotation = 0;

    this.faceColor = this.colors.faces;

    this.initVertices(center, size);
    return this;
  }
  initVertices(center, size) {
    var r = size / 2;
    this.vertices = [
      new Vertex(center.x + r, center.y + r, center.z + r),
      new Vertex(center.x + r, center.y + r, center.z - r),
      new Vertex(center.x + r, center.y - r, center.z - r),
      new Vertex(center.x + r, center.y - r, center.z + r),
      new Vertex(center.x - r, center.y + r, center.z + r),
      new Vertex(center.x - r, center.y + r, center.z - r),
      new Vertex(center.x - r, center.y - r, center.z - r),
      new Vertex(center.x - r, center.y - r, center.z + r)
    ];

    let v = this.vertices;
    this.faces = [
      [v[0], v[3], v[7], v[4]],
      [v[2], v[3], v[7], v[6]],
      [v[5], v[4], v[0], v[1]],
      [v[0], v[1], v[2], v[3]],
      [v[4], v[5], v[6], v[7]],
      [v[1], v[2], v[6], v[5]]
    ];
    this.applyRotation();
  }

  set lineColor(color) {
    this.color.line = color;
  }
  get lineColor() {return this.color.line}

  applyRotation() {
    let x = this.horizontalRotation;
    for (let i = 0; i < this.vertices.length; i++) {
      let v = this.vertices[i];
      let newX = this.center.x + (v.x-this.center.x)*Math.cos(x) - (v.z-this.center.z)*Math.sin(x);
      let newZ = this.center.z + (v.x-this.center.x)*Math.sin(x) + (v.z-this.center.z)*Math.cos(x)
      this.vertices[i].x = newX;
      this.vertices[i].z = newZ;
    }
  }

  setHorizontalRotation(angle) {
    this.horizontalRotation = this.toRadians(angle);
    this.applyRotation();
  }
  changePos(vertex) {
    this.center = vertex;
    this.initVertices(vertex, this.size);
    return this;
  }

  toRadians(degrees) {
    return degrees * Math.PI / 180;
  }
}
