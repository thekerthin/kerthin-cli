import * as inquirer from 'inquirer';
import * as ora from 'ora';
import { isEmptyOrNil } from '@kerthin/utils';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { Project } from '../../../lib/config/project';
import { RunnerFactory } from '../../../lib/runners/runner.factory';
import { Runners } from '../../../lib/runners/runners';
import { RepositorySchematic } from '../../../lib/schematics/repository.schematic';
import { SchematicOption } from '../../../lib/schematics/schematic.option';
import { MESSAGES } from '../../../lib/ui/messages';
import { Generator } from './generator';
import { ModuleQuestion, RunQuestion } from '../../../lib/question';

export class RepositoryGenerator extends Generator {

  async execute(...args: any[]): Promise<void> {
    Project.isValidProject();
    Project.isThereAtLeastOneModule();

    const spinner = ora();
    const runner = RunnerFactory.create(Runners.SCHEMATIC);

    const answers = await this.askQuestions();

    const options = Object.entries(answers)
      .map(([key, value]: [string, string]) => new SchematicOption(key, value));

    spinner.start(MESSAGES.REPOSITORY_GENERATING_FILES);

    await (new RepositorySchematic(runner)).execute(options);

    spinner.succeed(MESSAGES.REPOSITORY_FILES_GENERATED);
  }

  private async askQuestions() {
    const { moduleName } = await RunQuestion.run(ModuleQuestion);

    Project.isThereAtLeastOneEntityOrAggregate(moduleName, 'repository');

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What\'s the repository name?',
        validate: (input) => {
          if (isEmptyOrNil(input)) {
            return 'The repository name cannot be empty.';
          }
          const repositoryName = `${classify(input)}Repository`;
          const repositories = Project.getRepositories(moduleName);
          if (repositories.includes(repositoryName)) {
            return `The repository '${repositoryName}' already exist.`;
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'entity',
        message: 'Choice entity or aggregate',
        choices: this.getAggregatesAndEntities(moduleName)
      }
    ]);

    return { moduleName, ...answers };
  }

  private getAggregatesAndEntities(moduleName: string) {
    const sources = [];
    const aggregates = Project.getAggregates(moduleName);
    const entities = Project.getEntities(moduleName);

    if (aggregates.length > 0) {
      sources.push(new inquirer.Separator(
        `Aggregate${aggregates.length > 1 ? 's' : ''}`
      ));
      sources.push(...aggregates);
    }

    if (entities.length > 0) {
      sources.push(new inquirer.Separator(
        entities.length > 1 ? 'Entities' : 'Entity'
      ));
      sources.push(...entities);
    }

    return sources;
  }

}
