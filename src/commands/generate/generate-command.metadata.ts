import { CommandMetadata } from '../command';

export class GenerateCommandMetadata extends CommandMetadata {
    alias = 'g';

    command = 'generate <target>';

    description = `\n   Available targets:
    * module
    * value_object
    * aggregate
    * entity
    * event
    * use_case
    * repository
    `;

    options = [];
}
