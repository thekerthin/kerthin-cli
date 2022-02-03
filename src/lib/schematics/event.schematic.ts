import { Runner } from '../runners/runner';
import { Schematic } from './schematic';
import { Schematics } from './schematics';

export class EventSchematic extends Schematic {
  static schematic = Schematics.KERTHIN;
  static collection = 'event';

  constructor(runner: Runner) {
    super(
      EventSchematic.schematic,
      EventSchematic.collection,
      runner,
    );
  }
}
