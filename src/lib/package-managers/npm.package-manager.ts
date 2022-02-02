import { RunnerFactory } from '../runners/runner.factory';
import { Runners } from '../runners/runners';
import { NpmRunner } from '../runners/npm.runner';
import { AbstractPackageManager } from './abstract.package-manager';
import { PackageManager } from './package-manager';
import { PackageManagerCommands } from './package-manager-commands';

export class NpmPackageManager extends AbstractPackageManager {
  constructor() {
    super(RunnerFactory.create(Runners.NPM) as NpmRunner);
  }

  public get name(): string {
    return PackageManager.NPM.toUpperCase();
  }

  get cli(): PackageManagerCommands {
    return {
      install: 'install'
    };
  }
}
