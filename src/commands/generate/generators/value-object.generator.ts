import * as inquirer from 'inquirer';
import * as ora from 'ora';
import { isEmptyOrNil } from '@kerthin/utils';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { Project } from '../../../lib/config/project';
import { RunnerFactory } from '../../../lib/runners/runner.factory';
import { Runners } from '../../../lib/runners/runners';
import { SchematicOption } from '../../../lib/schematics/schematic.option';
import { ValueObjectSchematic } from '../../../lib/schematics/value-object.schematic';
import { Generator } from './generator';
import { MESSAGES } from '../../../lib/ui/messages';
import { ModuleQuestion, RunQuestion } from '../../../lib/question';

export class ValueObjectGenerator extends Generator {

  async execute(...args: any[]): Promise<void> {
    Project.isValidProject();
    Project.isThereAtLeastOneModule();

    const spinner = ora();
    const runner = RunnerFactory.create(Runners.SCHEMATIC);

    const { moduleName } = await RunQuestion.run(ModuleQuestion);
    const answers = await this.askQuestions(moduleName);

    const options = Object.entries({ moduleName, ...answers })
      .map(([key, value]: [string, string]) => new SchematicOption(key, value));

    spinner.start(MESSAGES.VALUE_OBJECT_GENERATING_FILES);

    await (new ValueObjectSchematic(runner)).execute(options);

    spinner.succeed(MESSAGES.VALUE_OBJECT_FILES_GENERATED);
  }

  private askQuestions(moduleName: string) {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What\'s the value object name?',
        validate: (input) => {
          if (isEmptyOrNil(input)) {
            return 'The value object name cannot be empty.';
          }
          const valueObjectName = classify(input);
          const valueObjects = Project.getValueObjects(moduleName);
          if (valueObjects.includes(valueObjectName)) {
            return `The value object '${valueObjectName}' already exist.`;
          }
          return true;
        }
      }
    ]);
  }

}
