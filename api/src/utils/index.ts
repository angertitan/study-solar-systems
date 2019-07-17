import { Request, Response, NextFunction } from 'express';
import { spawn } from 'child_process';

import { getGeocodeData, GeocodeObj } from './fetch';
import { getDUT, getDeltaT } from './time';
import * as config from './config';

function parseCalcData(data: string): {}[] | {} {
  const dataRows = data.split('\n');

  if (dataRows.length < 2) {
    const [key, errorCode] = dataRows[0].split(':');
    const errorMessage = `Given data on Argument${errorCode} is out of valid range`;

    return { [key]: errorMessage };
  }

  const dataRowObjects = dataRows.map((dataRow): {} => {
    const [key, value] = dataRow.split(':');
    return { [key]: value };
  });
  return dataRowObjects;
}

function calculateSpaHandler(_req: Request, res: Response): void {
  const ls = spawn(`${__dirname}/calc/spa`);

  ls.stdout.on('data', (data): void => {
    const parsedData = parseCalcData(data.toString());
    res.status(200).json(parsedData);
  });

  ls.on('close', (): void => {
    res.end();
  });
}

function geocodeHandler(req: Request, res: Response, next: NextFunction): void {
  const {
    latitude, longitude, city, ...rest
  } = req.query;

  if (Object.keys(rest).length > 1) {
    next({ error: 'use longitude, latitude or city for query' });
  }

  if (Object.keys(city).length < 1) {
    next({ error: 'search parameter are required' });
  }

  if (latitude && longitude) {
    if (Number(latitude) > 90 || Number(latitude) < -90) {
      next({ error: 'latitude must be in range from -90 to 90' });
    }

    if (Number(longitude) > 180 || Number(longitude) < -180) {
      next({ error: 'latitude must be in range from -180 to 180' });
    }

    getGeocodeData([latitude, longitude])
      .then((result): void => {
        res.send(result);
      })
      .catch((err): void => {
        next(err);
      });
  }

  if (latitude && !longitude) {
    next({ error: 'longitude must be set if latitude is set' });
  }

  if (!latitude && longitude) {
    next({ error: 'longitude must be set if latitude is set' });
  }

  const queryValues = city.split(',');

  getGeocodeData(queryValues).then((results): void => {
    const output = results.map((result): GeocodeObj => {
      const {
        geometry, components, formatted, annotations
      } = result;
      return {
        components,
        geometry,
        formatted,
        annotations
      };
    });
    res.send(output);
  });
}

export {
  getDUT, getDeltaT, parseCalcData, calculateSpaHandler, config, geocodeHandler
};
