import Decimal from 'decimal.js';
import constants from './constants';

export function rad2deg(radians: number): number {
  const valueInDef = radians * 180;
  return valueInDef / constants.PI;
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

interface TermObject {
  [key: string]: number;
}

export function termCalc(jme: number, termKey: string, index: number): Decimal {
  const rTerms = constants.TERMS[`${termKey}_TERMS`][`${termKey}${index}`];

  const r = rTerms.reduce((accumulator: Decimal, curr: TermObject): Decimal => {
    const { A, B, C } = curr;
    const cos = new Decimal(B + C * jme).cos();
    const ri = cos.times(A);

    const result = accumulator.add(ri);
    return result;
  }, new Decimal(0));

  return r;
}

export function earthHeliocentricLongitude(jme: number): number {
  const L0 = termCalc(jme, 'L', 0).div(10.0 ** 8);
  const L1 = termCalc(jme, 'L', 1)
    .times(jme)
    .div(10.0 ** 8);
  const L2 = termCalc(jme, 'L', 2)
    .times(jme ** 2)
    .div(10.0 ** 8);
  const L3 = termCalc(jme, 'L', 3)
    .times(jme ** 3)
    .div(10.0 ** 8);
  const L4 = termCalc(jme, 'L', 4)
    .times(jme ** 4)
    .div(10.0 ** 8);
  const L5 = termCalc(jme, 'L', 5)
    .times(jme ** 5)
    .div(10.0 ** 8);

  const l = L0.add(L1)
    .add(L2)
    .add(L3)
    .add(L4)
    .add(L5);

  const result = limitDegrees360(rad2deg(l.toNumber()));
  return result;
}

export function earthHeliocentricLatitude(jme: number): number {
  const b0 = termCalc(jme, 'B', 0).div(10.0 ** 8);
  const b1 = termCalc(jme, 'B', 1)
    .times(jme)
    .div(10.0 ** 8);

  const b = b0.add(b1);

  const result = rad2deg(b.toNumber());
  return result;
}

export function earthRadiusVector(jme: number): number {
  const r0 = termCalc(jme, 'R', 0).div(10.0 ** 8);
  const r1 = termCalc(jme, 'R', 1)
    .times(jme)
    .div(10.0 ** 8);
  const r2 = termCalc(jme, 'R', 2)
    .times(jme ** 2)
    .div(10.0 ** 8);
  const r3 = termCalc(jme, 'R', 3)
    .times(jme ** 3)
    .div(10.0 ** 8);
  const r4 = termCalc(jme, 'R', 4)
    .times(jme ** 4)
    .div(10.0 ** 8);

  const r = r0
    .add(r1)
    .add(r2)
    .add(r3)
    .add(r4);

  const result = r.toNumber();
  return result;
}
