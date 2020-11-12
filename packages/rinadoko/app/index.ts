import * as PIXI from "pixi.js";

const app = new PIXI.Application({ transparent: true });
document.getElementById("app").appendChild(app.view);

const images = [{ name: "hako-1", url: "images/hako-1.png" }] as const;

images.forEach(image => {
  app.loader.add(image.name, image.url);
});

app.loader.load((loader, resources) => {
  const selectArrow = new PIXI.Graphics();
  selectArrow.beginFill(0xff3300);
  selectArrow.lineStyle(4, 0xffd900, 1);
  selectArrow.moveTo(-150, 0);
  selectArrow.lineTo(150, 0);
  selectArrow.lineTo(0, 200);
  selectArrow.lineTo(-150, 0);
  selectArrow.closePath();
  selectArrow.endFill();

  const boxes = Array.from(new Array(3)).map(() => {
    const container = new PIXI.Container();
    const hako = new PIXI.Sprite(resources["hako-1"].texture);
    hako.anchor.set(0.5);
    hako.scale.set(0.3);
    hako.interactive = true;
    hako.buttonMode = true;
    hako.on("pointerover", e => {
      selectArrow.y = -300;
      hako.addChild(selectArrow);
    });
    hako.on("pointerout", e => {
      hako.removeChild(selectArrow);
    });

    container.addChild(hako);

    return container;
  });

  boxes[0].x = 100;
  boxes[0].y = 300;

  boxes[1].x = 400;
  boxes[1].y = 300;

  boxes[2].x = 700;
  boxes[2].y = 300;

  app.stage.addChild(...boxes);
});
