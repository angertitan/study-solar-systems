import * as dotenv from 'dotenv';

dotenv.config();

const {
  OPENCAGE_API: geocodeAPI, PORT: port, ELEVATION_TOKEN: elevationToken, WEATHER_KEY: weatherKey
} = process.env;

export {
  geocodeAPI, port, elevationToken, weatherKey
};
