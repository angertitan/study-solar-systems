import { getUsnoDataFromDate } from './fetch';

const taiOffset = 37 * 1000;

function getTaiTime(date: Date): number {
  const utcTime = date;
  const utcTimestamp = utcTime.getTime();
  const taiTime = utcTimestamp + taiOffset;
  return taiTime;
}

function getTTTime(taiTime: number): number {
  return taiTime + 32184;
}
function getUTTime(date: Date, dut: number): number {
  const utcTime = date || new Date();
  const utcTimestamp = utcTime.getTime();
  const utTime = utcTimestamp + dut * 1000;

  return utTime;
}

/**
 *
 * get the difference between ut1 and utc from usno in sec
 *
 * @param date today
 */
export async function getDUT(date?: Date): Promise<number> {
  const today = new Date() || date;

  const dataObject = await getUsnoDataFromDate(today);
  const deltaUT = Number(dataObject['A UT1-UTC']);
  return Number(deltaUT.toFixed(4));
}

/**
 *
 * calculate the differenc between ttTime and utTime in sec
 *
 * @param dut delta u, get it from usno or use an approx. value
 * @param date today
 */
export function getDeltaT(dut: number, date?: Date): number {
  const theDate = date || new Date();
  const taiTime = getTaiTime(theDate);

  const ttTime = getTTTime(taiTime);
  const utTime = getUTTime(theDate, dut);
  const deltaT = ttTime - utTime;
  return Number((deltaT / 1000).toFixed(2));
}

// export async function getJulianDate(day: number, month: number, year: number, hour: number, minute: number, seconds: number, timezone: number): Promise<number> {
//   const dut = await getDUT();

//   const y = month > 2 ? year : year - 1;
//   const m = month > 2 ? month : month + 12;
//   const d = day + (hour - timezone + (minute + (seconds + dut) / 60) / 60) / 24;

//   const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d - 1524.5;

//   if (jd > 2299160) {
//     const a = Math.floor(y / 100);
//     const correctedJd = jd + (2 - a + Math.floor(a / 4));
//     return correctedJd;
//   }

//   return jd;
// }

// export function julianToUTC(jd: number): number[] {
//   const z = Math.floor(jd + 0.5);
//   const f = jd + 0.5 - z;
//   const alpha = Math.floor((z - 1867216.25) / 36524.25);
//   const a = z + 1 + alpha - Math.floor(alpha / 4);

//   const b = a + 1524;
//   const c = Math.floor((b - 122.1) / 365.25);
//   const d = Math.floor(365.25 * c);
//   const e = Math.floor((b - d) / 30.6001);

//   const day = b - d - Math.floor(30.6001 * e) + f;

//   const month = e <= 13 ? e - 1 : e - 13;
//   const year = e <= 13 ? c - 4716 : c - 4715;

//   return [day, month, year];
// }

// export function getJulianEphemerisDay(jd: number, deltaT: number): number {
//   const jde = jd + deltaT / 86400;
//   return jde;
// }

// export function getJulianCentury(jd: number): number {
//   const jc = (jd - 2451545) / 36525;
//   return jc;
// }

// export function getJulianEphemerisCentury(jde: number): number {
//   const jce = (jde - 2451545) / 36525;
//   return jce;
// }

// export function getJulianEphemerisMillennium(jce: number): number {
//   const jme = jce / 10;
//   return jme;
// }
