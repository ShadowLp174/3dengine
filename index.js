class RenderEngine {
  constructor() {
    return this;
  }
  load() {
    return new Promise(async function(resolve, reject) {
      fetch("./modules/modules.json").then((res)=>res.json().then(async(modules) => {
        for (let i = 0; i < modules.registry.length; i++) {
          let response = await fetch("./modules/" + modules.registry[i] + "?q=" + new Date().getTime());
          let txt = await response.text();
          let script = document.createElement("script");
          script.innerHTML = txt;
          document.body.appendChild(script);
        }
        resolve({ moduleCount: modules.registry.length });
      }));
    });
  }
}
