class Cube {
  constructor(center, size) {
    this.color = {};
    this.size = size;

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
      [v[2], v[3], v[7], v[6]],
      [v[0], v[3], v[7], v[4]],
      [v[5], v[4], v[0], v[1]],
      [v[0], v[1], v[2], v[3]],
      [v[4], v[5], v[6], v[7]],
      [v[1], v[2], v[6], v[5]]
    ];
  }

  set faceColor(color) {
    this.color.face = color;
  }
  get faceColor() {return this.color.face}

  set lineColor(color) {
    this.color.line = color;
  }
  get lineColor() {return this.color.line}

  rotate(angle) {

  }
  changePos(vertex) {
    this.initVertices(vertex, this.size);
    return this;
  }
}
