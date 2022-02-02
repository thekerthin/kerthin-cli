import { Runner } from '../runners/runner';
import { Schematic } from './schematic';
import { Schematics } from './schematics';

export class EntitySchematic extends Schematic {
  static schematic = Schematics.KERTHIN;
  static collection = 'entity';

  constructor(runner: Runner) {
    super(
      EntitySchematic.schematic,
      EntitySchematic.collection,
      runner,
    );
  }
}
