import { spawn, SpawnOptions } from 'child_process';
import * as chalk from 'chalk';

export abstract class Runner {

  constructor(protected readonly binary: string) {}

  run(
    command: string,
    collect = false,
    cwd: string = process.cwd()
  ): Promise<void | string> {
    const args = [command];
    const options: SpawnOptions = {
      cwd,
      stdio: collect ? 'pipe' : 'inherit',
      shell: true,
    };

    return new Promise((resolve, reject): void => {
      const child = spawn(this.binary, [...args], options);

      if (collect) {
        child.stdout?.on('data', (data) =>
          resolve(data.toString().replace(/\r\n|\n/, '')));
      }

      child.on('close', (code) => {
        if (code === 0) {
          resolve(null);
        } else {
          console.error(
            chalk.red(
              // MESSAGES.RUNNER_EXECUTION_ERROR(`${this.binary} ${command}`),
              'error...',
            ),
          );
          reject();
        }
      });
    });
  }

}
