import { Generator } from './generator';

export class UseCaseGenerator extends Generator {
  execute(...args: any[]): void | Promise<void> {
    throw new Error('Method not implemented.');
  }
}
