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
