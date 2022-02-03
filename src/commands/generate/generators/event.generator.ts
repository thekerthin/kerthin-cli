import * as inquirer from 'inquirer';
import * as ora from 'ora';
import { isEmptyOrNil } from '@kerthin/utils';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { Project } from '../../../lib/config/project';
import { RunnerFactory } from '../../../lib/runners/runner.factory';
import { Runners } from '../../../lib/runners/runners';
import { EventSchematic } from '../../../lib/schematics/event.schematic';
import { SchematicOption } from '../../../lib/schematics/schematic.option';
import { MESSAGES } from '../../../lib/ui/messages';
import { Generator } from './generator';
import { ModuleQuestion, RunQuestion } from '../../../lib/question';

export class EventGenerator extends Generator {

  async execute(...args: any[]): Promise<void> {
    Project.isValidProject();
    Project.isThereAtLeastOneModule();

    const spinner = ora();
    const runner = RunnerFactory.create(Runners.SCHEMATIC);

    const answers = await this.askQuestions();

    const options = Object.entries(answers)
      .map(([key, value]: [string, string]) => new SchematicOption(key, value));

    spinner.start(MESSAGES.EVENT_GENERATING_FILES);

    await (new EventSchematic(runner)).execute(options);

    spinner.succeed(MESSAGES.EVENT_FILES_GENERATED);
  }

  private async askQuestions() {
    const { moduleName } = await RunQuestion.run(ModuleQuestion);

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What\'s the event name?',
        validate: (input) => {
          if (isEmptyOrNil(input)) {
            return 'The event name cannot be empty.';
          }
          const eventName = `${classify(input)}Event`;
          const events = Project.getEvents(moduleName);
          if (events.includes(eventName)) {
            return `The event '${eventName}' already exist.`;
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'action',
        message: 'Give an action name in past.',
        validate: (input) => {
          if (isEmptyOrNil(input)) {
            return 'The event name cannot be empty.';
          }
          return true;
        }
      }
    ]);

    return { moduleName, ...answers };
  }

}
