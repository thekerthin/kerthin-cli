import * as inquirer from 'inquirer';
import * as ora from 'ora';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { isEmptyOrNil } from '@kerthin/utils';
import { Generator } from './generator';
import { RunnerFactory } from '../../../lib/runners/runner.factory';
import { Runners } from '../../../lib/runners/runners';
import { Project } from '../../../lib/config/project';
import { EntitySchematic } from '../../../lib/schematics/entity.schematic';
import { SchematicOption } from '../../../lib/schematics/schematic.option';
import { MESSAGES } from '../../../lib/ui/messages';
import * as uiConsole from '../../../lib/ui/console';
import { RunQuestion, ModuleQuestion } from '../../../lib/question';

export class EntityGenerator extends Generator {

  async execute(...args: any[]): Promise<void> {
    Project.isValidProject();
    Project.isThereAtLeastOneModule();

    const spinner = ora();
    const runner = RunnerFactory.create(Runners.SCHEMATIC);

    const answers = await this.askQuestions();

    answers.properties = answers.properties
      .map(({ name, type, isList }) => `${name}:${type}${isList ? ':true' : ''}`)
      .join(',');

    const options = Object.entries(answers)
      .map(([key, value]: [string, string]) => new SchematicOption(key, value));

    spinner.start(MESSAGES.ENTITY_GENERATING_FILES);

    await (new EntitySchematic(runner)).execute(options);

    spinner.succeed(MESSAGES.ENTITY_FILES_GENERATED);
  }

  private async askQuestions() {
    const { moduleName } = await RunQuestion.run(ModuleQuestion);

    Project.isThereAtLeastOneValueObject(moduleName, 'entity');

    const { name } = await this.askForEntityName(moduleName);

    uiConsole.log(MESSAGES.ENTITY_PROPERTIES_TITLE`${name}`);

    const valueObjects = Project.getValueObjects(moduleName);

    const properties = await this.askForDomainProperties(valueObjects);

    return { moduleName, name, properties };
  }

  private async askForEntityName(moduleName: string) {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What\'s the entity name?',
        validate: (input) => {
          if (isEmptyOrNil(input)) {
            return 'The entity name cannot be empty.';
          }
          const entityName = classify(input);
          const entities = Project.getEntities(moduleName);
          if (entities.includes(entityName)) {
            return `The entity '${entityName}' already exist.`;
          }
          return true;
        }
      },
    ]);
  }

  private async askForDomainProperties(valueObjects: string[], properties = []) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What\'s the property name?',
        validate: (input) => {
          if (isEmptyOrNil(input)) {
            return 'The property name cannot be empty.';
          }
          const propNameAlreadyExist = properties.some(({ name }) => name === input);
          if (propNameAlreadyExist) {
            return `The property '${input}' already exist.`;
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'type',
        message: 'Choice value object',
        choices: valueObjects
      },
      {
        type: 'confirm',
        name: 'isList',
        message: 'Is a list (default No)?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'askAgain',
        message: 'Do you want to add another property (just hit enter for YES)?',
        default: true,
      }
    ]);

    const { name, type, isList } = answers;

    properties.push({ name, type, isList });

    if (answers.askAgain) {
      // const valueObjectsFiltered = valueObjects.filter(valueObject => type !== valueObject);
      // return await this.askForDomainProperties(valueObjectsFiltered, properties);
      // const valueObjectsFiltered = valueObjects.filter(valueObject => type !== valueObject);
      return await this.askForDomainProperties(valueObjects, properties);
    }

    return properties;
  }

}
