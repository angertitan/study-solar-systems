import * as express from 'express';
import * as winston from 'winston';

import * as cors from 'cors';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as boom from '@hapi/boom';
import * as expressWinston from 'express-winston';

import getShadowCast from './utils/shadowcast';

// create server
const server = express();

// MIDDLEWARE

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use(helmet());

server.use(cors());

// create logger
server.use(
  expressWinston.logger({
    transports: [new winston.transports.File({ filename: `${__dirname}/server.log` })],
    format: winston.format.combine(winston.format.colorize(), winston.format.json())
  })
);

server.get(
  '/',
  (_req, res): void => {
    res.send('use /calculate/:method or /shadowcast');
  }
);

server.get('/calculate/');

server.get('/calculate/:method');

server.get('/shadowcast', getShadowCast);

server.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console(), new winston.transports.File({ filename: `${__dirname}/error.log` })],
    format: winston.format.combine(winston.format.colorize(), winston.format.json())
  })
);

// ENDPOINTS

// ERROR HANDLING

server.use(
  (err: boom, _res: express.Request, res: express.Response): void => {
    if (err.isServer) {
      console.error(err);
    }
    res.status(err.output.statusCode).json(err.output.payload);
  }
);
// SERVER START

server.listen(3000, () => {
  console.log('Server listen, go to http://localhost:3000');
});
