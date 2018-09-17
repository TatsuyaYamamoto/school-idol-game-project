import { getLogger } from "@sokontokoro/mikan";

const logger = getLogger("engine");

class Engine {
  init(params) {
    logger.debug(`"start ${this.constructor.name}`, params);
  }

  tearDown() {
    logger.debug(`"end ${this.constructor.name}`);
  }
}

export default Engine;
