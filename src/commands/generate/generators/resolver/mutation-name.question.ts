import { Answers, Question } from 'inquirer';
import { isEmptyOrNil } from '@kerthin/utils';

export class MutationNameQuestion implements Question {
  type = 'input';
  name = 'name';
  message = 'What\'s mutation the name?';

  // when(answers: Answers): boolean {
  //   return answers.type === 'Mutation';
  // }

  validate(input: string): boolean | string {
    if (isEmptyOrNil(input)) {
      return 'The mutation name cannot be empty.';
    }
    return true;
  }

}
