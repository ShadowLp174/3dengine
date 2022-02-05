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
