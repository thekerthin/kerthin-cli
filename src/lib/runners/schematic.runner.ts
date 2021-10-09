import { Runner } from './runner';

export class SchematicRunner extends Runner {

  constructor() {
    super(SchematicRunner.getSchematicBinary());
  }

  static getSchematicBinary(): string {
    try {
      return require.resolve(
        '@angular-devkit/schematics-cli/bin/schematics.js',
        { paths: module.paths },
      );
    } catch {
      throw new Error('\'schematics\' binary path could not be found!');
    }
  }

}
