import { Command, CommandMetadata } from './command';
import { NewCommandMetadata } from './new-command.metadata';
import { NewSchematic } from '../lib/schematics/new.schematic';
import { SchematicOption } from '../lib/schematics/schematic.option';
import { RunnerFactory } from '../lib/runners/runner.factory';
import { Runners } from '../lib/runners/runners';

export class NewCommand extends Command {

  getMetadata(): CommandMetadata {
    return new NewCommandMetadata();
  }

  async action(name: string): Promise<void> {
    const runner = RunnerFactory.create(Runners.SCHEMATIC);
    const options = [
      new SchematicOption('name', name)
    ];

    await (new NewSchematic(runner)).execute(options);
  }

}
