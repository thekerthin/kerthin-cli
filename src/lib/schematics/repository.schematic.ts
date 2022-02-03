import { Runner } from '../runners/runner';
import { Schematic } from './schematic';
import { Schematics } from './schematics';

export class RepositorySchematic extends Schematic {
  static schematic = Schematics.KERTHIN;
  static collection = 'repository';

  constructor(runner: Runner) {
    super(
      RepositorySchematic.schematic,
      RepositorySchematic.collection,
      runner,
    );
  }
}
