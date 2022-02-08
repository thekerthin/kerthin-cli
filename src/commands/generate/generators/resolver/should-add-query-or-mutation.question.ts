import { Question } from 'inquirer';

export class ShouldAddQueryOrMutationQuestion implements Question {
  type = 'confirm';
  name = 'shouldAddQueryOrMutation';
  message = 'Do you want to add a query/mutation? (default Yes)';
  default = true;
}
