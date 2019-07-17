import { Request, Response, NextFunction } from 'express';
import { spawn } from 'child_process';
import * as dfns from 'date-fns';

import {
  getGeocodeData, GeocodeObj, getElevation, getWeatherData
} from './fetch';
import { getDUT, getDeltaT } from './time';

interface BaseObject {
  [key: string]: string | number;
}

/**
 *
 * parses the string receiving from the c-file.
 * Outputs a Object.
 *
 * @param data incomming data from c-file
 */

function parseCalcData(data: string): BaseObject {
  const dataRows = data.split('\n');

  if (dataRows.length < 2) {
    const [key, errorCode] = dataRows[0].split(':');
    const errorMessage = `Given data on Argument${errorCode} is out of valid range`;

    return { [key]: errorMessage };
  }
  const output: BaseObject = {};
  dataRows.forEach((dataRow): void => {
    const [key, value] = dataRow.split(':');
    output[key] = value;
  });
  return output;
}

/**
 * validate the incoming data from express and sets up the datastructure for the c-file
 * @param data incoming data from express
 */
async function validateSpaData(data: BaseObject): Promise<BaseObject> {
  if (!data.lat) {
    return { error: 'lat must be set for calculation' };
  }

  if (!data.lng) {
    return { error: 'lng must be set for calculation' };
  }

  const { lat, lng, timezone } = data;

  const date = new Date();

  const year = data.year || dfns.getYear(date);
  const month = data.month || dfns.getMonth(date);
  const day = data.day || dfns.getDate(date);
  const hour = data.hour || dfns.getHours(date);
  const minute = data.minute || dfns.getMinutes(date);
  const second = data.second || dfns.getSeconds(date);

  const spaDate = new Date(`${year}-${month}-${day}`);

  const dut = await getDUT(spaDate);
  const deltaT = getDeltaT(dut, spaDate);

  const elevation = await getElevation(lat, lng);
  const weatherDataObj = await getWeatherData(lat, lng);
  const { pressure, temp } = weatherDataObj;
  return {
    year, month, day, hour, minute, second, timezone, dut, deltaT, lng, lat, elevation, pressure, temp
  };
}

/**
 * handler for the spa route.
 * validates data and sets up the datastructure for the c file
 * spawns a childprocess and runs the c-file
 *
 * @param req express Request
 * @param res express Response
 * @param next express NextFunction
 */
export function spaHandler(req: Request, res: Response, next: NextFunction): void {
  const validate = validateSpaData(req.query);

  validate.then((validatedData): void => {
    if (validatedData.error) {
      next({ error: validatedData.error });
      return;
    }

    const values = Object.values(validatedData);
    const stringifiedValues = values.map((value): string => String(value));

    const ls = spawn(`${process.cwd()}/dist/spa`, stringifiedValues);

    ls.stdout.on('data', (data): void => {
      const parsedData = parseCalcData(data.toString());
      res.status(200).json(parsedData);
    });

    ls.on('close', (): void => {
      res.end();
    });
  });
}

/**
 * handler for the geocode route.
 * validates the given data and makes a call to opencage
 * sends the receiving data to the client
 *
 * @param req
 * @param res
 * @param next
 */
export function geocodeHandler(req: Request, res: Response, next: NextFunction): void {
  const {
    lat, lng, location, ...rest
  } = req.query;

  if (Object.keys(rest).length > 1) {
    next({ error: 'use lat and lng together or location for query' });
  }

  if (lat && !lng) {
    next({ error: 'lng must be set if lat is set' });
  }

  if (!lat && lng) {
    next({ error: 'lat must be set if lat is set' });
  }

  if (!location) {
    if (Number(lat) > 90 || Number(lat) < -90) {
      next({ error: 'lat must be in range from -90 to 90' });
    }

    if (Number(lng) > 180 || Number(lng) < -180) {
      next({ error: 'lat must be in range from -180 to 180' });
    }

    getGeocodeData([lat, lng])
      .then((result): void => {
        res.send(result);
      })
      .catch((err): void => {
        next(err);
      });
  }

  if (Object.keys(location).length < 1) {
    next({ error: 'search parameter are required' });
  }

  const queryValues = location.split(',');

  getGeocodeData(queryValues).then((results): void => {
    const output = results.map(
      (result): GeocodeObj => {
        const {
          geometry, components, formatted, annotations
        } = result;
        return {
          components,
          geometry,
          formatted,
          annotations
        };
      }
    );
    res.status(200).send(output);
  });
}

/**
 * handler for the weather route.
 * validates query data and sends a request to openweather api
 * sends result to the client
 * @param req
 * @param res
 * @param next
 */
export function weatherHandler(req: Request, res: Response, next: NextFunction): void {
  const { lat, lng } = req.query;

  if (!lat) next('lat must be set');

  if (!lng) next('lng must be set');

  getWeatherData(lat, lng).then((result): void => {
    res.status(200).send(result);
  });
}
