#!/usr/bin/env node

import { Command } from 'commander';
import { CommandLoader } from '../commands/command.loader';

function bootstrap() {
  const program = new Command();
  try {
    CommandLoader.load(program);
    program.parse(process.argv);
  } catch (error) {
    program.outputHelp();
  }
}

bootstrap();
