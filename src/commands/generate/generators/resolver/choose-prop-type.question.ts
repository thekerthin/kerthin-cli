import { Question } from 'inquirer';

export class ChoosePropTypeQuestion implements Question {
  type = 'table';
  name = 'objTypesD';
  message = 'Assign property\ns types';
  rows = [];
  columns = [
    {
      name: 'ID',
      value: 'ID'
    },
    {
      name: 'String',
      value: 'String'
    },
    {
      name: 'Int',
      value: 'Int'
    },
    {
      name: 'Float',
      value: 'Float'
    },
    {
      name: 'Boolean',
      value: 'Boolean'
    },
    {
      name: 'Array<ID>',
      value: '[ID]'
    },
    {
      name: 'Array<String>',
      value: '[String]'
    },
    {
      name: 'Array<Int>',
      value: '[Int]'
    },
    {
      name: 'Array<Float>',
      value: '[Float]'
    },
    {
      name: 'Array<Boolean>',
      value: '[Boolean]'
    }
  ];

  static create(props: string[]): Question {
    const question = new ChoosePropTypeQuestion();
    question.rows = props.map((name, index) => ({ name, value: index }));
    return question;
  }

}
