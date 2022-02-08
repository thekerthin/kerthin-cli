import { Question } from 'inquirer';
import { isEmptyOrNil } from '@kerthin/utils';

export class ObjTypeNameQuestion implements Question {
  type = 'input';
  name = 'name';
  message = 'What\'s object type the name?';

  validate(input: string): boolean | string {
    if (isEmptyOrNil(input)) {
      return 'The object type name cannot be empty.';
    }
    return true;
  }

}
