import { getPrototypes, Class } from '@kerthin/utils';
import { Command as CommandCommander } from 'commander';
import { resolve } from 'path';
import { Command } from './command';

export class CommandLoader {

  static load(program: CommandCommander): void {
    const commandsPath = resolve(__dirname, './*.command{.ts,.js}');

    getPrototypes(commandsPath)
      .forEach((command: Class<Command>) => (new command(program)).build());
  }

}
