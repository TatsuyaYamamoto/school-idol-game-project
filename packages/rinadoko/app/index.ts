import * as PIXI from "pixi.js";

const app = new PIXI.Application({ transparent: true });
document.getElementById("app").appendChild(app.view);

const images = [{ name: "hako-1", url: "images/hako-1.png" }] as const;

images.forEach(image => {
  app.loader.add(image.name, image.url);
});

app.loader.load((loader, resources) => {
  const hako1 = new PIXI.Sprite(resources["hako-1"].texture);
  hako1.anchor.set(0.5);
  hako1.scale.set(0.3);
  hako1.x = 100;
  hako1.y = 300;

  const hako2 = new PIXI.Sprite(resources["hako-1"].texture);
  hako2.anchor.set(0.5);
  hako2.scale.set(0.3);
  hako2.x = 400;
  hako2.y = 300;

  const hako3 = new PIXI.Sprite(resources["hako-1"].texture);
  hako3.anchor.set(0.5);
  hako3.scale.set(0.3);
  hako3.x = 700;
  hako3.y = 300;

  app.stage.addChild(hako1, hako2, hako3);
});
