import Decimal from 'decimal.js';
import constants from './constants';

export function rad2deg(radians: number): number {
  return (180 / constants.PI) * radians;
}

export function def2rad(degrees: number): number {
  return (constants.PI / 180) * degrees;
}

export function limitDegreesByValue(degrees: number, value: number): number {
  const newDegrees = degrees / value;
  const limited = value * (newDegrees - Math.floor(degrees));

  return limited;
}

export function limitDegrees360(degrees: number): number {
  const limited = limitDegreesByValue(degrees, 360);

  if (limited < 0) {
    const correctedLimited = limited + 360;
    return correctedLimited;
  }
  return limited;
}

export function limitDegrees180(degrees: number): number {
  const limited = limitDegreesByValue(degrees, 180);

  if (limited < 0) {
    const correctedLimited = limited + 180;
    return correctedLimited;
  }
  return limited;
}

export function limitDegrees180pm(degrees: number): number {
  const limited = limitDegreesByValue(degrees, 360);

  if (limited > 180) {
    const correctedLimited = limited - 360;
    return correctedLimited;
  }

  if (limited < -180) {
    const correctedLimited = limited + 360;
    return correctedLimited;
  }

  return limited;
}

export function limitZero2One(value: number): number {
  const limited = value - Math.floor(value);

  if (limited < 0) {
    const correctedLimited = limited + 1;
    return correctedLimited;
  }

  return limited;
}

export function limitMinuntes(minutes: number): number {
  if (minutes < -20) {
    const limited = minutes + 1440;
    return limited;
  }

  if (minutes > 20) {
    const limited = minutes - 1440;
    return limited;
  }

  return minutes;
}

export function dayfracToLocalHr(dayfrac: number, timezone: number): number {
  return 24.0 * limitZero2One(dayfrac + timezone / 24.0);
}

export function thirdOrderPolynomial(a: number, b: number, c: number, d: number, x: number): number {
  return ((a * x + b) * x + c) * x + d;
}

interface LTermObject {
  A: number;
  B: number;
  C: number;
}

export function getL0(jme: number): Decimal {
  const l1Terms = constants.L_TERMS.L0;

  const l0 = l1Terms.reduce((accumulator: Decimal, curr: LTermObject): Decimal => {
    const { A, B, C } = curr;
    const cos = new Decimal(B + C * jme).cos();
    const l0i = cos.times(A);

    const result = accumulator.add(l0i);
    return result;
  }, new Decimal(0));

  return l0;
}

export function getL1(jme: number): Decimal {
  const l1Terms = constants.L_TERMS.L1;

  const l1 = l1Terms.reduce((accumulator: Decimal, curr: LTermObject): Decimal => {
    const { A, B, C } = curr;
    const cos = new Decimal(B + C * jme).cos();
    const l1i = cos.times(A);

    const result = accumulator.add(l1i);
    return result;
  }, new Decimal(0));

  return l1;
}

export function getL2(jme: number): Decimal {
  const l1Terms = constants.L_TERMS.L2;

  const l2 = l1Terms.reduce((accumulator: Decimal, curr: LTermObject): Decimal => {
    const { A, B, C } = curr;
    const cos = new Decimal(B + C * jme).cos();
    const l2i = cos.times(A);

    const result = accumulator.add(l2i);
    return result;
  }, new Decimal(0));

  return l2;
}

export function getL3(jme: number): Decimal {
  const l1Terms = constants.L_TERMS.L3;

  const l3 = l1Terms.reduce((accumulator: Decimal, curr: LTermObject): Decimal => {
    const { A, B, C } = curr;
    const cos = new Decimal(B + C * jme).cos();
    const l3i = cos.times(A);

    const result = accumulator.add(l3i);
    return result;
  }, new Decimal(0));

  return l3;
}

export function getL4(jme: number): Decimal {
  const l1Terms = constants.L_TERMS.L4;

  const l4 = l1Terms.reduce((accumulator: Decimal, curr: LTermObject): Decimal => {
    const { A, B, C } = curr;
    const cos = new Decimal(B + C * jme).cos();
    const l4i = cos.times(A);

    const result = accumulator.add(l4i);
    return result;
  }, new Decimal(0));

  return l4;
}

export function getL5(jme: number): Decimal {
  const l1Terms = constants.L_TERMS.L5;

  const l5 = l1Terms.reduce((accumulator: Decimal, curr: LTermObject): Decimal => {
    const { A, B, C } = curr;
    const cos = new Decimal(B + C * jme).cos();
    const l5i = cos.times(A);

    const result = accumulator.add(l5i);
    return result;
  }, new Decimal(0));

  return l5;
}

export function earthHeliocentricLongitude(jme: number): number {
  const L0 = getL0(jme);
  const L1 = getL1(jme).times(jme);
  const L2 = getL2(jme).times(jme ** 2);
  const L3 = getL3(jme).times(jme ** 3);
  const L4 = getL4(jme).times(jme ** 4);
  const L5 = getL5(jme).times(jme ** 5);

  const L = L0.add(L1)
    .add(L2)
    .add(L3)
    .add(L4)
    .add(L5);

  const result = limitDegrees360(rad2deg(L.div(10 ** 8).toNumber()));
  return result;
}
