class Cube {
  constructor(center, size) {
    var d = size / 2;
    this.color = {};

    this.vertices = [
      new Vertex(center.x - d, center.y - d, center.z + d),
      new Vertex(center.x - d, center.y - d, center.z - d),
      new Vertex(center.x + d, center.y - d, center.z - d),
      new Vertex(center.x + d, center.y - d, center.z + d),
      new Vertex(center.x + d, center.y + d, center.z + d),
      new Vertex(center.x + d, center.y + d, center.z - d),
      new Vertex(center.x - d, center.y + d, center.z - d),
      new Vertex(center.x - d, center.y + d, center.z + d)
    ]
    this.faces = [
		  [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
      [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
      [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
      [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
      [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
      [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
	  ];
    return this;
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
}
