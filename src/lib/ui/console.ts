import * as chalk from 'chalk';

export const error = (message: string): void => {
  console.log(
    chalk.red(`Error: ${message}`)
  );
};

export const log = (message: string, color = 'blue'): void => {
  console.log(
    chalk[color](message)
  );
};
