import * as inquirer from 'inquirer';
import * as ora from 'ora';
import { isEmptyOrNil } from '@kerthin/utils';
import { Command, CommandMetadata } from '../command';
import { NewCommandMetadata } from './new-command.metadata';
import { NewSchematic } from '../../lib/schematics/new.schematic';
import { SchematicOption } from '../../lib/schematics/schematic.option';
import { RunnerFactory } from '../../lib/runners/runner.factory';
import { Runners } from '../../lib/runners/runners';
import { PackageManagerFactory } from '../../lib/package-managers';
import { MESSAGES } from '../../lib/ui/messages';

type CommandOptions = {
  packageManager: 'yarn' | 'npm';
  db: 'postgresql' | 'mongodb';
}

export class NewCommand extends Command {

  getMetadata(): CommandMetadata {
    return new NewCommandMetadata();
  }

  async action(name: string, commands: CommandOptions): Promise<void> {
    const spinner = ora();
    const runner = RunnerFactory.create(Runners.SCHEMATIC);

    const { db, packageManager } = await this.askMissingQuestions(commands);

    const options = [
      new SchematicOption('name', name),
      new SchematicOption('db', db),
    ];

    spinner.start(MESSAGES.NEW_PROJECT_GENERATING_SCAFFOLDING`${name}`);

    await (new NewSchematic(runner)).execute(options);

    spinner.succeed(MESSAGES.NEW_PROJECT_SCAFFOLDING_GENERATED`${name}`);

    PackageManagerFactory
      .create(commands.packageManager || packageManager)
      .install(name);
  }

  private askMissingQuestions(commands: CommandOptions) {
    const questions = [
      {
        type: 'list',
        name: 'db',
        message: 'Which database do you want to use?',
        choices: ['postgresql', 'mongodb']
      }
    ];

    if (isEmptyOrNil(commands.packageManager)) {
      questions.push({
        type: 'list',
        name: 'packageManager',
        message: 'Which package manager do you prefer?',
        choices: ['npm', 'yarn']
      });
    }

    return inquirer.prompt(questions);
  }

}
