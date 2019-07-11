import * as time from './utils/time';
import { getL0, getL1 } from './utils/calculate';

const start = new Date().getTime();
console.log(start);

const jd = 2452930.312847;

const jde = time.getJulianEphemerisDay(jd, 67);
const jce = time.getJulianEphemerisCentury(jde);
const jme = time.getJulianEphemerisMillennium(jce);

console.log('L0', getL0(jme));
console.log('L1', getL1(jme));

const stop = new Date().getTime() - start;

console.log(stop / 1000);
