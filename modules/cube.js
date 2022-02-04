class Cube {
  constructor(center, size) {
    var r = size / 2;
    this.color = {};

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

    /*this.faces = [
      [v[2], v[3], v[7], v[6]],
      [v[0], v[3]]
    ];*/
    /*this.faces = [
      [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
      [this.vertices[3], this.vertices[2], this.vertices[6], this.vertices[7]],
      [this.vertices[0], this.vertices[1], this.vertices[]]
    ];*/

    /*this.vertices = [
      new Vertex(center.x - d, center.y - d, center.z + d),
      new Vertex(center.x - d, center.y - d, center.z - d),
      new Vertex(center.x + d, center.y - d, center.z - d),
      new Vertex(center.x + d, center.y - d, center.z + d),
      new Vertex(center.x + d, center.y + d, center.z + d),
      new Vertex(center.x + d, center.y + d, center.z - d),
      new Vertex(center.x - d, center.y + d, center.z - d),
      new Vertex(center.x - d, center.y + d, center.z + d)
    ]*/
    /*this.faces = [
		  [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
      [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
      [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
      [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
      [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
      [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
	  ];*/
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
