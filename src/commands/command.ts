import { Command as CommandCommander } from 'commander';
import * as chalk from 'chalk';
import * as figlet from 'figlet';

export abstract class CommandMetadata {
  abstract  alias: string;
  abstract command: string;
  abstract description: string;
  abstract options: Array<string[]>;
}

export abstract class Command {

  abstract getMetadata(): CommandMetadata;

  protected program: CommandCommander;

  constructor(
    protected readonly commander: CommandCommander
  ) { }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected abstract action(arg1: any, arg2?: any): void;

  build(): void {
    const { command, alias, description, options } = this.getMetadata();

    const program = this.commander
      .command(command)
      .alias(alias)
      .description(description)
      .action(this.action.bind(this));

    options.forEach(([flag, description, defaultValue]: string[]) => {
      program.option(flag, description, defaultValue);
    });

    this.program = program;
  }

  protected log(message: string): void {
    console.log(
      chalk.blue(
        figlet.textSync(message, { horizontalLayout: 'full', width: 80 })
      )
    );
  }

}
