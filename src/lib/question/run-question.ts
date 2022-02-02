import { Class } from '@kerthin/utils';
import { Answers } from 'inquirer';
import { Question } from './question';

export class RunQuestion {

  static run(_question: Class<Question>): Promise<Answers> {
    const question = new _question();
    return question.ask();
  }

}
