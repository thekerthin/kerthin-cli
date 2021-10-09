import { Command, CommandMetadata } from './command';
import { GenerateCommandMetadata } from './generate-command.metadata';

export class NewGenerateCommand extends Command {
  getMetadata(): CommandMetadata {
    return new GenerateCommandMetadata();
  }

  action(target: string): void {
    console.log('target', target);
  }
}
