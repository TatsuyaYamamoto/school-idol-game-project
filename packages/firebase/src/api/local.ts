// import { initializeApp } from "firebase-admin";
// initializeApp();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

(async () => {
  const app = await NestFactory.create(AppModule);
  app.listen(3000);
})();
