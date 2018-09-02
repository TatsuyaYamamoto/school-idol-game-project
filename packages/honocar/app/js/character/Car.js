import config from "../resources/config";
import globals from "../globals";

function Car(number) {
  this.init(number);
}

Car.prototype.init = function(number) {
  const { queue, gameStage, gameScrean, gameScreenScale } = globals;

  switch (number) {
    case 0:
      this.img = new createjs.Bitmap(queue.getResult("CAR1_BACK"));
      this.img.x = gameScrean.width / 8;
      this.img.y = gameScrean.height + config.system.car.height / 2;
      this.img.regX = config.system.car.width / 2;
      this.img.regY = config.system.car.height / 2;
      this.img.scaleY = this.img.scaleX = gameScreenScale;
      this.lane = 0;
      this.passed = false;
      break;
    case 1:
      this.img = new createjs.Bitmap(queue.getResult("CAR1_BACK"));
      this.img.x = (gameScrean.width / 8) * 3;
      this.img.y = gameScrean.height + config.system.car.height / 2;
      this.img.regX = config.system.car.width / 2;
      this.img.regY = config.system.car.height / 2;
      this.img.scaleY = this.img.scaleX = gameScreenScale;
      this.lane = 1;
      this.passed = false;
      break;
    case 2:
      this.img = new createjs.Bitmap(queue.getResult("CAR1_FRONT"));
      this.img.x = (gameScrean.width / 8) * 5;
      this.img.y = -config.system.car.height / 2;
      this.img.regX = config.system.car.width / 2;
      this.img.regY = config.system.car.height / 2;
      this.img.scaleY = this.img.scaleX = gameScreenScale;
      this.lane = 2;
      this.passed = false;
      break;
    case 3:
      this.img = new createjs.Bitmap(queue.getResult("CAR1_FRONT"));
      this.img.x = (gameScrean.width / 8) * 7;
      this.img.y = -config.system.car.height / 2;
      this.img.regX = config.system.car.width / 2;
      this.img.regY = config.system.car.height / 2;
      this.img.scaleY = this.img.scaleX = gameScreenScale;
      this.lane = 3;
      this.passed = false;
      break;
  }

  gameStage.addChild(this.img);

  this.move();
};
Car.prototype.move = function() {
  const { gameScrean } = globals;
  var target = this;

  switch (target.lane) {
    case 0:
      createjs.Tween.get(target.img)
        .to({ y: -config.system.car.height }, config.system.car.slowerSpeed)
        .call(function() {
          target.passed = true;
        });
      break;
    case 1:
      createjs.Tween.get(target.img)
        .to({ y: -config.system.car.height }, config.system.car.fasterSpeed)
        .call(function() {
          target.passed = true;
        });
      break;
    case 2:
      createjs.Tween.get(target.img)
        .to(
          { y: gameScrean.height + config.system.car.height },
          config.system.car.fasterSpeed
        )
        .call(function() {
          target.passed = true;
        });
      break;
    case 3:
      createjs.Tween.get(target.img)
        .to(
          { y: gameScrean.height + config.system.car.height },
          config.system.car.slowerSpeed
        )
        .call(function() {
          target.passed = true;
        });
      break;
  }
};

export default Car;
