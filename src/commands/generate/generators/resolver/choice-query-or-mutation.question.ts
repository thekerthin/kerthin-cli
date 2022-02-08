import { Answers, Question } from 'inquirer';

export class ChoiceQueryOrMutationQuestion implements Question {
  type = 'list';
  name = 'type';
  message = 'Choice';
  choices = [
    'Query',
    'Mutation'
  ];

  // when(answers: Answers): boolean {
  //   return answers.shouldAddQueryOrMutation;
  // }
}
