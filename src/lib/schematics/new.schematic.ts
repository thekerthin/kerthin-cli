import { Runner } from '../runners/runner';
import { Schematic } from './schematic';
import { Schematics } from './schematics';

export class NewSchematic extends Schematic {
  static schematic = Schematics.KERTHIN;
  static collection = 'new-app';

  constructor(runner: Runner) {
    super(
      NewSchematic.schematic,
      NewSchematic.collection,
      runner,
    );
  }
}
