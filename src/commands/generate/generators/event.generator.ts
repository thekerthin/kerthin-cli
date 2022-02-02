import { Generator } from './generator';

export class EventGenerator extends Generator {
  execute(...args: any[]): void | Promise<void> {
    throw new Error('Method not implemented.');
  }
}
