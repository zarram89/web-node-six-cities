import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public execute(): void {
    console.log(chalk.bold.cyan('\nПрограмма для подготовки данных для REST API сервера.\n'));
    console.log(chalk.gray('Пример: cli.js --<command> [--arguments]\n'));
    console.log(chalk.bold('Команды:\n'));
    console.log(`${chalk.green('  --version') }                   ${ chalk.gray('# выводит номер версии')}`);
    console.log(`${chalk.green('  --help') }                      ${ chalk.gray('# печатает этот текст')}`);
    console.log(`${chalk.green('  --import <path>') }             ${ chalk.gray('# импортирует данные из TSV')}`);
    console.log(`${chalk.green('  --generate <n> <path> <url>') }  ${ chalk.gray('# генерирует произвольное количество тестовых данных')}`);
    console.log();
  }
}
