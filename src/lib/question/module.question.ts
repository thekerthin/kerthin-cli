import { QuestionCollection, Answers, prompt } from 'inquirer';
import { Project } from '../config/project';
import { Question } from './question';

export class ModuleQuestion extends Question {
  getRawQuestions(): QuestionCollection<Answers> {
    const modules = Project.getModules();
    return [
      {
        type: 'list',
        name: 'moduleName',
        message: 'Choice module',
        choices: modules
      }
    ];
  }

  ask(): Promise<Answers> {
    const questions = this.getRawQuestions();
    return prompt(questions);
  }

}
