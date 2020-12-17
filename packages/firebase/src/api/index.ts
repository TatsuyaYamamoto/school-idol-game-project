import { NestFactory } from "@nestjs/core";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as express from "express";
import * as helmet from "helmet";

import { AppModule } from "./app.module";

const expressInstance = express();
let app: INestApplication | null = null;

const getExpressInstance = async (): Promise<express.Express> => {
  if (!app) {
    app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressInstance)
    );
    app.useGlobalPipes(new ValidationPipe());
    app.use(helmet());
    app.enableCors();
    await app.init();
  }

  return expressInstance;
};

export { getExpressInstance };
