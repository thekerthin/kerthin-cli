import { Command, CommandMetadata } from '../command';
import { GenerateCommandMetadata } from './generate-command.metadata';
import { GeneratorFactory } from './generators/generator.factory';
import { Targets } from './targets.enum';
import { isValidTarget } from './utils';
import * as uiConsole from '../../lib/ui/console';

export class NewGenerateCommand extends Command {
  getMetadata(): CommandMetadata {
    return new GenerateCommandMetadata();
  }

  async action(target: string): Promise<void> {
    if (!isValidTarget(target)) {
      return this.program.help();
    }

    const generator = GeneratorFactory.getGenerator(target as Targets);

    try {
      await generator.execute();
    } catch (error) {
      uiConsole.error(error.message);
    }
  }

}
