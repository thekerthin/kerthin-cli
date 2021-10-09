import { Runner } from './runner';
import { Runners } from './runners';
import { SchematicRunner } from './schematic.runner';

export class RunnerFactory {

  public static create(runner: Runners): Runner {
    switch (runner) {
      case Runners.SCHEMATIC:
        return new SchematicRunner();
      default:
        throw new Error('Invalid runner.');
    }
  }

}
