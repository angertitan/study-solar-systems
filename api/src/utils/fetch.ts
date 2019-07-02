import axios, { AxiosResponse } from 'axios';

const headers: { [key: number]: string } = {
  2: 'year',
  4: 'month',
  6: 'day',
  7: 'blank',
  15: 'MJD',
  16: 'blank',
  17: 'flag',
  18: 'blank',
  27: 'A PM-x',
  36: 'error PM-x',
  37: 'blank',
  46: 'A PM-y',
  55: 'error PM-y',
  57: 'blank',
  58: 'flag',
  68: 'A UT1-UTC',
  78: 'error UT1-UTC',
  79: 'blank',
  86: 'A LOD',
  93: 'error LOD',
  95: 'blank',
  96: 'flag',
  97: 'blank',
  106: 'A dPSI',
  115: 'error dPSI',
  116: 'blank',
  125: 'A dEPSILON',
  134: 'error dEPSILON',
  144: 'B PM-x',
  154: 'B PM-y',
  165: 'B UT1-UTC',
  175: 'B dPSI',
  185: 'B dEPSILON'
};

export function usnoParser(dataString: string): { [key: string]: string }[] {
  const dataRows = dataString.split(/\r?\n/);
  const parsedData = dataRows.map((row): [string, string][] => {
    const splittedRow = row.split('');
    const headerKeys = Object.keys(headers);
    const parsedRow = headerKeys.map((key): [string, string] => {
      const numberdKey = Number(key);
      const objectKey = headers[numberdKey];

      if (headers[numberdKey] === 'blank') {
        return [objectKey, ''];
      }

      const index = headerKeys.indexOf(key);
      const prevKey = Number(headerKeys[index - 1]) || 0;
      const chars = splittedRow.slice(prevKey, numberdKey);
      const value = chars.filter((char): boolean => char !== ' ');
      return [objectKey, value.join('')];
    });

    const cleanedRowData = parsedRow.filter((rowData): boolean => {
      if (rowData[0] === 'blank') {
        return false;
      }
      if (rowData[0] === 'flag') {
        return false;
      }
      return true;
    });
    return cleanedRowData;
  });
  const objectifiedData = parsedData.map((data): {} => {
    const rowObject: { [key: string]: string } = {};
    data.forEach((rowData): void => {
      const key = rowData[0];
      const value = rowData[1];
      rowObject[key] = value;
    });
    return rowObject;
  });
  return objectifiedData;
}

export function getUsnoData(): Promise<AxiosResponse> {
  return axios.get('http://maia.usno.navy.mil/ser7/finals.daily');
}

export async function getUsnoDataFromDate(date: Date): Promise<{ [key: string]: string }> {
  const usnoData = await getUsnoData();
  const parsedData = usnoParser(usnoData.data);

  const year = date.getFullYear() - 2000;
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const output = parsedData.filter((data): boolean => {
    if (Number(data.year) !== year) return false;
    if (Number(data.month) !== month) return false;
    if (Number(data.day) !== day) return false;

    return true;
  });
  return output[0];
}
