import axios from 'axios';

const headers = {
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

axios.get('http://maia.usno.navy.mil/ser7/finals.daily').then((res) => {
  const data = res.data;
  console.log(data);
});
