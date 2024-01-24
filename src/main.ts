import 'reflect-metadata';

import { appConfig } from './config/app';
import { useContainer as routingControllersUseContainer, useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { Container } from 'typedi';
import express from 'express';
import AppDataSource from './libs/database';

export class App {
  private app: express.Application = express();
  private port: Number = appConfig.port;

  constructor() {
    this.bootstrap();
  }

  async bootstrap() {
    this.loadContainers();
    this.loadApp();

    await this.loadDb();
    this.loadMiddlewares();

    this.runServer();
  }

  async loadContainers() {
    routingControllersUseContainer(Container);
  }

  async loadDb() {
    try {
      await AppDataSource.initialize();
    } catch (error) {
      console.log('Caught! Cannot connect to database: ', error);
    }
  }

  loadApp() {
    useExpressServer(this.app, {
      validation: { stopAtFirstError: true },
      classTransformer: true,
      defaultErrorHandler: false,
      cors: true,
      controllers: [__dirname + '/api/controllers/*'],
      middlewares: [__dirname + '/api/middlewares/*'],
    });
  }

  runServer() {
    const server = require('http').Server(this.app);
    server.listen(this.port, () => console.log(`Server started at http://localhost:${this.port}\n`));
  }

  loadMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
}

new App();
