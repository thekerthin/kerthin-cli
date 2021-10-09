import { Command as CommandCommander } from 'commander';

export abstract class CommandMetadata {
  abstract  alias: string;
  abstract command: string;
  abstract description: string;
  abstract options: Array<string[]>;
}

export abstract class Command {

  abstract getMetadata(): CommandMetadata;

  constructor(
    protected readonly program: CommandCommander
  ) { }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected abstract action(arg1: any, arg2?: any): void;

  build(): void {
    const { command, alias, description, options } = this.getMetadata();

    const program = this.program
      .command(command)
      .alias(alias)
      .description(description)
      .action(this.action);

    options.forEach(([flag, description, defaultValue]: string[]) => {
      program.option(flag, description, defaultValue);
    });
  }

}
