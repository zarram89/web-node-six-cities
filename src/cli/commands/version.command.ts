import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Command } from './command.interface.js';

export class VersionCommand implements Command {
  public getName(): string {
    return '--version';
  }

  public execute(): void {
    try {
      const packageJsonPath = resolve('./package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      console.log(chalk.bold.blue(packageJson.version));
    } catch (error) {
      console.error(chalk.red('Ошибка при чтении package.json:'), error);
    }
  }
}
