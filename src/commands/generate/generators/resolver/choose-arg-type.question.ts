import { Separator, Question } from 'inquirer';
import * as chalk from 'chalk';

export class ChooseArgTypeQuestion implements Question {
  type = 'list';
  name = 'argType';
  message = 'Choose arg type';
  choices = [
    new Separator('Native Primitives'),
    'String',
    'Int',
    'Float',
    'Boolean',
    new Separator('Custom Args'),
    'Pagination',
    chalk.blue('Create Custom')
  ];
}
