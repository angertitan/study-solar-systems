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

export function getL0(jme: number): number {
  const l0Terms = constants.L_TERMS.L0;

  const l0 = l0Terms.reduce((accumulator: number, curr: LTermObject): number => {
    const { A, B, C } = curr;

    const l0i = A * Math.cos(B + C * jme);
    console.log('l0i', l0i);
    const result = accumulator + l0i;
    return result;
  }, 0);

  return l0;
}

export function getL1(jme: number): Decimal {
  const l1Terms = constants.L_TERMS.L1;

  const l1 = l1Terms.reduce((accumulator: Decimal, curr: LTermObject): Decimal => {
    const { A, B, C } = curr;
    const cos = new Decimal(B + C * jme).cos();
    const l1i = cos.times(A);
    console.log('l1i', l1i);

    const result = accumulator.add(l1i);
    return result;
  }, new Decimal(0));

  return l1;
}

// function getL0(jme: number): number {
//   const l0Terms = constants.L_TERMS.L0;

//   const l0 = l0Terms.reduce((accumulator: number, curr: LTermObject): number => {
//     const { A, B, C } = curr;

//     const l0i = A * Math.cos(B + C * jme);
//     const result = accumulator + l0i;
//     return result;
//   }, 0);

//   return l0;
// }
// function getL0(jme: number): number {
//   const l0Terms = constants.L_TERMS.L0;

//   const l0 = l0Terms.reduce((accumulator: number, curr: LTermObject): number => {
//     const { A, B, C } = curr;

//     const l0i = A * Math.cos(B + C * jme);
//     const result = accumulator + l0i;
//     return result;
//   }, 0);

//   return l0;
// }
// function getL0(jme: number): number {
//   const l0Terms = constants.L_TERMS.L0;

//   const l0 = l0Terms.reduce((accumulator: number, curr: LTermObject): number => {
//     const { A, B, C } = curr;

//     const l0i = A * Math.cos(B + C * jme);
//     const result = accumulator + l0i;
//     return result;
//   }, 0);

//   return l0;
// }
// function getL0(jme: number): number {
//   const l0Terms = constants.L_TERMS.L0;

//   const l0 = l0Terms.reduce((accumulator: number, curr: LTermObject): number => {
//     const { A, B, C } = curr;

//     const l0i = A * Math.cos(B + C * jme);
//     const result = accumulator + l0i;
//     return result;
//   }, 0);

//   return l0;
// }
