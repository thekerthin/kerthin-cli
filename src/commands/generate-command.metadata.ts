import { CommandMetadata } from './command';

export class GenerateCommandMetadata extends CommandMetadata {
    alias = 'g';

    command = 'generate <target>';

    description = 'Generate a new target: [module|aggregate|domain|value_object|event|use_case|repository]';

    options = [];
}
