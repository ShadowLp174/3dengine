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
  addObjects(objects) {
    for (let i = 0; i < objects.length; i++) {
      this.objects.push(objects[i]);
    }
    return this.objects;
  }
}
