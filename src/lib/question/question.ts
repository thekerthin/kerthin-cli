import { Answers, QuestionCollection } from 'inquirer';

export abstract class Question {
  abstract getRawQuestions(): QuestionCollection;
  abstract ask(): Promise<Answers>;
}
