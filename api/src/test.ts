import * as time from './utils/time';
import { earthHeliocentricLongitude, earthHeliocentricLatitude, earthRadiusVector } from './utils/calculate';

const jd = 2452930.31284722;

const jde = time.getJulianEphemerisDay(jd, 67);
const jce = time.getJulianEphemerisCentury(jde);
const jme = time.getJulianEphemerisMillennium(jce);

console.log('jme', jme);
console.log('jme^2', jme ** 2);

console.log('Longitude', earthHeliocentricLongitude(jme));
console.log('Latitude', earthHeliocentricLatitude(jme));
console.log('Radius Vector', earthRadiusVector(jme));
