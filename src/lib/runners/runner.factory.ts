import { NpmRunner } from './npm.runner';
import { Runner } from './runner';
import { Runners } from './runners';
import { SchematicRunner } from './schematic.runner';
import { YarnRunner } from './yarn.runner';

export class RunnerFactory {

  public static create(runner: Runners): Runner {
    switch (runner) {
      case Runners.SCHEMATIC:
        return new SchematicRunner();
      case Runners.NPM:
        return new NpmRunner();
      case Runners.YARN:
        return new YarnRunner();
      default:
        throw new Error('Invalid runner.');
    }
  }

}
