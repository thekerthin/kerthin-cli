import * as inquirer from 'inquirer';
import * as ora from 'ora';
import { isEmptyOrNil } from '@kerthin/utils';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { Generator } from './generator';
import { RunnerFactory } from '../../../lib/runners/runner.factory';
import { Runners } from '../../../lib/runners/runners';
import { Project } from '../../../lib/config/project';
import { SchematicOption } from '../../../lib/schematics/schematic.option';
import { AggregateSchematic } from '../../../lib/schematics/aggregate.schematic';
import { ModuleQuestion, RunQuestion } from '../../../lib/question';
import { MESSAGES } from '../../../lib/ui/messages';
import * as uiConsole from '../../../lib/ui/console';

export class AggregateGenerator extends Generator {

  async execute(...args: any[]): Promise<void> {
    Project.isValidProject();
    Project.isThereAtLeastOneModule();

    const spinner = ora();
    const runner = RunnerFactory.create(Runners.SCHEMATIC);

    const answers = await this.askQuestions();

    answers.properties = answers.properties
      .map(({ name, type, isList }) => `${name}:${type.split(/\(([^)]+)\)/)[2].trim()}${isList ? ':true' : ':false'}${type.includes('(E)') ? ':true': ':false'}`)
      .join(',');

    const options = Object.entries(answers)
      .map(([key, value]: [string, string]) => new SchematicOption(key, value));

    spinner.start(MESSAGES.AGGREGATE_GENERATING_FILES);

    await (new AggregateSchematic(runner)).execute(options);

    spinner.stop();
  }

  private async askQuestions() {
    const { moduleName } = await RunQuestion.run(ModuleQuestion);

    Project.isThereAtLeastOneValueObject(moduleName, 'aggregate');

    const { name } = await this.askForAggregateName(moduleName);

    uiConsole.log(MESSAGES.AGGREGATE_PROPERTIES_TITLE`${name}`);

    const sources = this.getTypeSources(moduleName);
    const properties = await this.askForDomainProperties(sources);

    return { moduleName, name, properties };

  }

  private async askForAggregateName(moduleName: string) {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What\'s the aggregate name?',
        validate: (input) => {
          if (isEmptyOrNil(input)) {
            return 'The aggregate name cannot be empty.';
          }
          const entityName = classify(input);
          const aggregates = Project.getAggregates(moduleName);
          if (aggregates.includes(entityName)) {
            return `The aggregate '${entityName}' already exist.`;
          }
          return true;
        }
      },
    ]);
  }

  private async askForDomainProperties(sources: string[], properties = []) {
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
        choices: sources
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
        message: 'Want to enter another domain property (value object) (just hit enter for YES)?',
        default: true,
      }
    ]);

    const { name, type, isList } = answers;
    properties.push({ name, type, isList });

    if (answers.askAgain) {
      // const sourcesFiltered = sources.filter(source => type !== source);
      return await this.askForDomainProperties(sources, properties);
    }

    return properties;
  }

  private getTypeSources(moduleName: string) {
    const sources = [];
    const valueObjects = Project.getValueObjects(moduleName);
    const entities = Project.getEntities(moduleName);

    sources.push(new inquirer.Separator(
      `Value Object${valueObjects.length > 1 ? 's' : ''}`
    ));
    sources.push(
      ...valueObjects.map(entity => `(VO) ${entity}`)
    );

    if (entities.length > 0) {
      sources.push(new inquirer.Separator(
        entities.length > 1 ? 'Entities' : 'Entity'
      ));
      sources.push(
        ...entities.map(entity => `(E) ${entity}`)
      );
    }

    return sources;
  }

}
