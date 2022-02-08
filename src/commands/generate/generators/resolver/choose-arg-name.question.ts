import { Answers, Question } from 'inquirer';
import { isEmptyOrNil } from '@kerthin/utils';

export class ChooseArgNameQuestion implements Question {
  type = 'input';
  name = 'argName';
  message = 'Arg name?';

  when(answers: Answers): boolean {
    const nativeTypes = [
      'String',
      'Int',
      'Float',
      'Boolean'
    ];
    return nativeTypes.includes(answers.argType);
  }

  validate(input: string): boolean | string {
    if (isEmptyOrNil(input)) {
      return 'The arg name cannot be empty.';
    }
    return true;
  }

}
