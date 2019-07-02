import {
  getDUT, getUTTime, getTTTime, getTaiTime, getDeltaT
} from './utils/time';

async function test(): Promise<void> {
  const now = new Date();
  const dut = await getDUT();
  const utTime = getUTTime(now, dut);
  const taiTime = getTaiTime(now);
  const ttTime = getTTTime(taiTime);
  const deltaT = getDeltaT(utTime, ttTime);

  console.log(deltaT);
}

test().catch((err) => {
  console.error(err);
});
