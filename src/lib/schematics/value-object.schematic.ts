import { Runner } from '../runners/runner';
import { Schematic } from './schematic';
import { Schematics } from './schematics';

export class ValueObjectSchematic extends Schematic {
  static schematic = Schematics.KERTHIN;
  static collection = 'value-object';

  constructor(runner: Runner) {
    super(
      ValueObjectSchematic.schematic,
      ValueObjectSchematic.collection,
      runner,
    );
  }
}
