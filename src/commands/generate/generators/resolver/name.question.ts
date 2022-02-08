import { Question } from 'inquirer';
import { isEmptyOrNil } from '@kerthin/utils';

export class NameQuestion implements Question {
  type = 'input';
  name = 'name';
  message = 'What\'s resolver the name?';

  validate(input: string): boolean | string {
    if (isEmptyOrNil(input)) {
      return 'The resolver name cannot be empty.';
    }
    return true;
  }

}
