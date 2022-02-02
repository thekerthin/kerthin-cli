import { dasherize } from '@angular-devkit/core/src/utils/strings';
import * as chalk from 'chalk';
import * as ora from 'ora';
import { join } from 'path';
import { Runner } from '../runners/runner';
import { MESSAGES } from '../ui';
import { PackageManagerCommands } from './package-manager-commands';

export abstract class AbstractPackageManager {
  constructor(protected runner: Runner) {}

  public async install(directory: string): Promise<void> {
    const spinner = ora({
      spinner: {
        interval: 120,
        frames: ['▹▹▹▹▹', '▸▹▹▹▹', '▹▸▹▹▹', '▹▹▸▹▹', '▹▹▹▸▹', '▹▹▹▹▸'],
      },
      text: MESSAGES.PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS,
    });

    spinner.start();

    try {
      const commandArguments = `${this.cli.install} --silent`;
      const collect = true;
      const dasherizedDirectory: string = dasherize(directory);

      await this.runner.run(
        commandArguments,
        collect,
        join(process.cwd(), dasherizedDirectory),
      );

      spinner.succeed(MESSAGES.PACKAGE_MANAGER_INSTALLATION_SUCCEED);

      console.info();
      console.info(MESSAGES.GET_STARTED_INFORMATION`${dasherizedDirectory}${this.name.toLowerCase()}`);
      console.info();
    } catch {
      spinner.fail();
      console.error(chalk.red(MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED));
    }
  }

  public abstract get name(): string;

  public abstract get cli(): PackageManagerCommands;
}
