import { Runner } from '../runners/runner';
import { SchematicOption } from './schematic.option';

export abstract class Schematic {

  constructor(
    private readonly schematic: string,
    private readonly collection: string,
    private readonly runner: Runner,
  ) {}

  async execute(options: SchematicOption[]): Promise<void> {
    const command = this.buildCommandLine(options);
    await this.runner.run(command);
  }

  private buildCommandLine(options: SchematicOption[]): string {
    return `${this.schematic}:${this.collection}${this.buildOptions(options)}`;
  }

  private buildOptions(options: SchematicOption[]): string {
    const build = (optionsInLine:string, currentOption: SchematicOption) => {
      optionsInLine += ` ${currentOption.toCommandString()}`;
      return optionsInLine;
    };
    return options.reduce<string>(build, '');
  }

}
