import { Targets } from './targets.enum';

export const isValidTarget = (value: string): boolean =>
  Object.values(Targets).includes(value as Targets);
