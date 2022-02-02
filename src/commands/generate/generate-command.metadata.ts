import { CommandMetadata } from '../command';

export class GenerateCommandMetadata extends CommandMetadata {
    alias = 'g';

    command = 'generate <target>';

    description = `Generate a new target:
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
