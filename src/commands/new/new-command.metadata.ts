import { CommandMetadata } from '../command';

export class NewCommandMetadata extends CommandMetadata {
	alias = 'n';

	command = 'new <name>';

	description = 'Create a new project';

	options = [
	  ['-p, --package-manager [package-manager]', 'Specify package manager.'],
	  ['-d, --db [database]', 'Specify database.']
	];
}
