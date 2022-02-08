import { Question } from 'inquirer';
import { Project } from '../../../../lib/config/project';

export class ChooseObjTypeFieldsQuestion implements Question {
  type = 'table';
  name = 'objTypes';
  message = 'Choose the fields you wish to show for the object type';
  rows = [];
  columns = [
    {
      name: '(Yes)',
      value: true
    },
    {
      name: '(Not)',
      value: undefined
    }
  ];

  static create(entityOrAggregateProps: string[]): Question {
    const question = new ChooseObjTypeFieldsQuestion();
    question.rows = entityOrAggregateProps
      .map((name, index) => ({ name, value: index }));
    return question;
  }

}
