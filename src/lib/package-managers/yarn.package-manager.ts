import { RunnerFactory } from '../runners/runner.factory';
import { Runners } from '../runners/runners';
import { YarnRunner } from '../runners/yarn.runner';
import { AbstractPackageManager } from './abstract.package-manager';
import { PackageManager } from './package-manager';
import { PackageManagerCommands } from './package-manager-commands';

export class YarnPackageManager extends AbstractPackageManager {
  constructor() {
    super(RunnerFactory.create(Runners.YARN) as YarnRunner);
  }

  public get name(): string {
    return PackageManager.YARN.toUpperCase();
  }

  get cli(): PackageManagerCommands {
    return {
      install: 'install'
    };
  }
}
