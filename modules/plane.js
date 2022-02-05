class Plane {
  constructor(vertices) {
    this.faces = [vertices];

    return this;
  }

  set color(color) {
    this.colors.faces = [color];
  }
  get color() {
    this.colors.faces[0];
  }
}
