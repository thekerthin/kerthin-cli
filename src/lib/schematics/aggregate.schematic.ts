import { Runner } from '../runners/runner';
import { Schematic } from './schematic';
import { Schematics } from './schematics';

export class AggregateSchematic extends Schematic {
  static schematic = Schematics.KERTHIN;
  static collection = 'aggregate';

  constructor(runner: Runner) {
    super(
      AggregateSchematic.schematic,
      AggregateSchematic.collection,
      runner,
    );
  }
}
