export abstract class Generator {
  abstract execute(...args: any[]): void | Promise<void>;
}
