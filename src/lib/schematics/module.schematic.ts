import { Runner } from '../runners/runner';
import { Schematic } from './schematic';
import { Schematics } from './schematics';

export class ModuleSchematic extends Schematic {
  static schematic = Schematics.KERTHIN;
  static collection = 'module';

  constructor(runner: Runner) {
    super(
      ModuleSchematic.schematic,
      ModuleSchematic.collection,
      runner,
    );
  }
}
