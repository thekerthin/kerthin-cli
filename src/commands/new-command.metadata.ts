import { CommandMetadata } from './command';

export class NewCommandMetadata extends CommandMetadata {
    alias = 'n';

    command = 'new <name>';

    description = 'Create a new project';

    options = [];
}
