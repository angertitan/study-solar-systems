import * as dotenv from 'dotenv';

dotenv.config();

const { OPENCAGE_API: geocodeAPI, PORT: port } = process.env;

export { geocodeAPI, port };
