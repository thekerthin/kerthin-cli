#!/usr/bin/env node

import { Command } from 'commander';
import { CommandLoader } from '../commands/command.loader';

const program = new Command();

CommandLoader.load(program);

program.parse(process.argv);
