import { Separator, Question } from 'inquirer';
import inquirer = require('inquirer');
import { Project } from '../../../../lib/config/project';

export class ChooseEntityQuestion implements Question {
  type = 'list';
  name = 'entity';
  message = 'Choose entity or aggregate';
  choices = [];

  static create(moduleName: string): Question {
    const question = new ChooseEntityQuestion();
    question.choices = ChooseEntityQuestion.getAggregatesAndEntities(moduleName);
    return question;
  }

  static getAggregatesAndEntities(moduleName: string): string[] {
    const sources = [];
    const aggregates = Project.getAggregates(moduleName);
    const entities = Project.getEntities(moduleName);

    if (aggregates.length > 0) {
      sources.push(new inquirer.Separator(
        `Aggregate${aggregates.length > 1 ? 's' : ''}`
      ));
      sources.push(...aggregates);
    }

    if (entities.length > 0) {
      sources.push(new inquirer.Separator(
        entities.length > 1 ? 'Entities' : 'Entity'
      ));
      sources.push(...entities);
    }

    return sources;
  }

}
