import { getUsnoDataFromDate } from './fetch';

const taiOffset = 37 * 1000;

export function getTaiTime(date?: Date): number {
  const utcTime = date || new Date();
  const utcTimestamp = utcTime.getTime();
  const taiTime = utcTimestamp + taiOffset;
  return taiTime;
}

export function getTTTime(taiTime: number): number {
  return taiTime + 32184;
}
export function getUTTime(date: Date, dut: number): number {
  const utcTime = date || new Date();
  const utcTimestamp = utcTime.getTime();
  const utTime = utcTimestamp + dut * 1000;

  return utTime;
}

export async function getDUT(): Promise<number> {
  const dataObject = await getUsnoDataFromDate(new Date());
  const deltaT = Number(dataObject['A UT1-UTC']);
  return deltaT;
}

export function getDeltaT(utTime: number, ttTime: number): number {
  const deltaT = ttTime - utTime;
  return deltaT;
}

export function getJulianDate(day: number, month: number, year: number): number {
  const y = month > 2 ? year : year - 1;
  const m = month > 2 ? month : month + 12;
  const d = day;

  const b = 2 - Math.floor(y / 100) + Math.floor(y / 400);

  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;

  return jd;
}

export function julianToUTC(jd: number): number[] {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  const alpha = Math.floor((z - 1867216.25) / 36524.25);
  const a = z + 1 + alpha - Math.floor(alpha / 4);

  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  const day = b - d - Math.floor(30.6001 * e) + f;

  const month = e <= 13 ? e - 1 : e - 13;
  const year = e <= 13 ? c - 4716 : c - 4715;

  return [day, month, year];
}

export function getJulianEphemerisDay(jd: number, deltaT: number): number {
  const jde = jd + deltaT / 86400;
  return jde;
}

export function getJulianCentury(jd: number): number {
  const jc = (jd - 351545) / 36525;
  return jc;
}

export function getJulianEphemerisCentury(jde: number): number {
  const jce = (jde - 351545) / 36525;
  return jce;
}

export function getJulianEphemerisMillennium(jce: number): number {
  const jme = jce / 36525;
  return jme;
}
