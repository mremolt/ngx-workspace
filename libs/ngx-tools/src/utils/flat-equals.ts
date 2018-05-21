import { difference } from 'ramda';

export function flatEquals(v1: { [key: string]: any } = {}, v2: { [key: string]: any } = {}): boolean {
  const k1 = Object.keys(v1);
  const k2 = Object.keys(v2);

  if (difference(k1, k2).length) {
    return false;
  }

  return !k1.some(key => v1[key] !== v2[key]);
}
