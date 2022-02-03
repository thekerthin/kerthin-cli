import * as inquirer from 'inquirer';
import * as ora from 'ora';
import { isEmptyOrNil } from '@kerthin/utils';
import { Project } from '../../../lib/config/project';
import { RunnerFactory } from '../../../lib/runners/runner.factory';
import { Runners } from '../../../lib/runners/runners';
import { ModuleSchematic } from '../../../lib/schematics/module.schematic';
import { SchematicOption } from '../../../lib/schematics/schematic.option';
import { Generator } from './generator';
import { MESSAGES } from '../../../lib/ui/messages';

export class ModuleGenerator extends Generator {

  async execute(...args: any[]): Promise<void> {
    Project.isValidProject();

    const spinner = ora();
    const runner = RunnerFactory.create(Runners.SCHEMATIC);
    const exitingModules = Project.getModules();
    const answers = await this.askQuestions(exitingModules);

    const options = Object.entries(answers)
      .map(([key, value]: [string, string]) => new SchematicOption(key, value));

    spinner.start(MESSAGES.MODULE_GENERATING_FILES);

    await (new ModuleSchematic(runner)).execute(options);

    spinner.succeed(MESSAGES.MODULE_FILES_GENERATED);
  }

  private askQuestions(exitingModules: string []) {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What\'s the module name?',
        validate: (input) => {
          if (isEmptyOrNil(input)) {
            return 'The module name cannot be empty.';
          }
          if (exitingModules.includes(input)) {
            return `The module '${input}' already exist.`;
          }
          return true;
        }
      },
    ]);
  }

}
