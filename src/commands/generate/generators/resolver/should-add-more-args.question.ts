import { Question } from 'inquirer';

export class ShouldAddMoreArgsQuestion implements Question {
  type = 'confirm';
  name = 'shouldAddMoreArgs';
  message = 'Do you want to add more args? (default Not)';
  default = false;
}
