import { Answers, Question } from 'inquirer';
import { isEmptyOrNil } from '@kerthin/utils';

export class QueryNameQuestion implements Question {
  type = 'input';
  name = 'name';
  message = 'What\'s query the name?';

  // when(answers: Answers): boolean {
  //   return answers.type === 'Query';
  // }

  validate(input: string): boolean | string {
    if (isEmptyOrNil(input)) {
      return 'The query name cannot be empty.';
    }
    return true;
  }

}
