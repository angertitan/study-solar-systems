function getJulianDate(day: number, month: number, year: number): number {
  const y = month > 2 ? year : year - 1;
  const m = month > 2 ? month : month + 12;
  const d = day;

  const b = 2 - Math.floor(y / 100) + Math.floor(y / 400);

  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;

  return jd;
}

function jdToDate(jd: number): number[] {
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
