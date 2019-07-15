import * as time from './utils/time';
import { earthHeliocentricLongitude } from './utils/calculate';

const start = new Date().getTime();

const jd = 2452930.31284722;

const jde = time.getJulianEphemerisDay(jd, 67);
const jce = time.getJulianEphemerisCentury(jde);
const jme = time.getJulianEphemerisMillennium(jce);

console.log('jme', jme);

console.log('L', earthHeliocentricLongitude(jme));

const stop = new Date().getTime() - start;

console.log(stop / 1000);
