import * as inquirer from 'inquirer';
import * as ora from 'ora';
import * as inquirerTablePrompt from 'inquirer-table-prompt';
import { Project } from '../../../../lib/config/project';
import { RunnerFactory } from '../../../../lib/runners/runner.factory';
import { Runners } from '../../../../lib/runners/runners';
import { SchematicOption } from '../../../../lib/schematics/schematic.option';
import { MESSAGES } from '../../../../lib/ui/messages';
import { Generator } from '../generator';
import { ModuleQuestion, RunQuestion } from '../../../../lib/question';
import { NameQuestion } from './name.question';
import { ShouldAddQueryOrMutationQuestion } from './should-add-query-or-mutation.question';
import { ChoiceQueryOrMutationQuestion } from './choice-query-or-mutation.question';
import { QueryNameQuestion } from './query-name.question';
import { MutationNameQuestion } from './mutation-name.question';
import { ChooseArgTypeQuestion } from './choose-arg-type.question';
import { ChooseArgNameQuestion } from './choose-arg-name.question';
import { ShouldAddMoreArgsQuestion } from './should-add-more-args.question';
import { ChooseObjTypeFieldsQuestion } from './choose-obj-type-fields.question';
import { ObjTypeNameQuestion } from './obj-type-name.question';
import { ChooseEntityQuestion } from './choose-entity.question';
import { ChoosePropTypeQuestion } from './choose-prop-type.question';

inquirer.registerPrompt('table', inquirerTablePrompt);

export class ResolverGenerator extends Generator {
  private moduleName: string;

  async execute(...args: any[]): Promise<void> {
    Project.isValidProject();
    Project.isThereAtLeastOneModule();

    const spinner = ora();
    const runner = RunnerFactory.create(Runners.SCHEMATIC);

    const answers = await this.askQuestions();

    console.log('answers', JSON.stringify(answers));


    // const options = Object.entries(answers)
    //   .map(([key, value]: [string, string]) => new SchematicOption(key, value));

    spinner.start(MESSAGES.EVENT_GENERATING_FILES);

    // await (new EventSchematic(runner)).execute(options);

    spinner.succeed(MESSAGES.EVENT_FILES_GENERATED);
  }

  private async askQuestions() {
    const { moduleName } = await RunQuestion.run(ModuleQuestion);
    this.moduleName = moduleName;

    const generalAnswers = await inquirer.prompt([
      new NameQuestion(),
      new ShouldAddQueryOrMutationQuestion(),
    ]);

    const resolverAnswers = generalAnswers.shouldAddQueryOrMutation
      ? await this.askResolverQuestions()
      : {};

    return { moduleName, ...generalAnswers, ...resolverAnswers };
  }

  private async askResolverQuestions(queries = [], mutations = []) {
    const queryOrMutationAnswer = await inquirer.prompt([
      new ChoiceQueryOrMutationQuestion(),
    ]);

    queryOrMutationAnswer.type === 'Query'
      ? queries.push(await this.askQueryQuestions())
      : mutations.push(await this.askMutationQuestions());

    const shouldAddMoreQueryOrMutationAnswer = await inquirer.prompt([
      new ShouldAddQueryOrMutationQuestion()
    ]);

    if (shouldAddMoreQueryOrMutationAnswer.shouldAddQueryOrMutation) {
      return await this.askResolverQuestions(queries, mutations);
    }

    return { queries, mutations };
  }

  private async askQueryQuestions() {
    const queryNameAnswer = await inquirer.prompt([new QueryNameQuestion()]);
    const argsAnswer = await this.askQueryArgs();
    const objTypeAnswer = await this.askObjectType();

    return { ...queryNameAnswer, args: argsAnswer, objType: objTypeAnswer };
  }

  private async askQueryArgs(args = []) {
    const queryArgsAnswer = await inquirer.prompt([
      new ChooseArgTypeQuestion(),
      new ChooseArgNameQuestion(),
      new ShouldAddMoreArgsQuestion()
    ]);

    args.push(queryArgsAnswer);

    if (queryArgsAnswer.shouldAddMoreArgs) {
      return await this.askQueryArgs(args);
    }

    return args;
  }

  private async askMutationQuestions() {
    const answers = await inquirer.prompt([
      new MutationNameQuestion(),
      new ChooseArgTypeQuestion(),
      new ChooseArgNameQuestion(),
      new ShouldAddMoreArgsQuestion()
    ]);

    return answers;
  }

  private async askObjectType() {
    /**
     * - render existing obj types
     * - select aggregate or entity
     */
    const nameAndEntityAnswer = await inquirer.prompt([
      new ObjTypeNameQuestion(),
      ChooseEntityQuestion.create(this.moduleName),
    ]);

    const entityOrAggregateProps = Project.getEntityOrAggregateProps(
      this.moduleName, nameAndEntityAnswer.entity
    );

    const objTypesAnswer = await inquirer.prompt([
      ChooseObjTypeFieldsQuestion.create(entityOrAggregateProps)
    ]);

    objTypesAnswer.objTypes = entityOrAggregateProps
      .map((propName, index) => `${propName}:${!!objTypesAnswer.objTypes[index]}`)
      .filter(prop => prop.includes('true'))
      .map((prop) => prop.split(':')[0]);

    const objTypesDAnswer = await inquirer.prompt([
      ChoosePropTypeQuestion.create(objTypesAnswer.objTypes)
    ]);

    objTypesDAnswer.objTypesD = objTypesAnswer.objTypes
      .map((propName, index) => `${propName}:${objTypesDAnswer.objTypesD[index]}`);

    return { ...nameAndEntityAnswer, ...objTypesAnswer, ...objTypesDAnswer };
  }

}
