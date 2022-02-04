class Scene {
  constructor() {
    this.objects = [];
    this.width = 0;
    this.height = 0;
    this.camera = new Camera(this);

    return this;
  }

  addObject(object) {
    this.objects.push(object);
    return this.objects;
  }
}
