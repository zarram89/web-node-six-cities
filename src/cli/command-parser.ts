import { Command } from './commands/command.interface.js';

export class CommandParser {
  private commands: Map<string, Command> = new Map();
  private defaultCommand = '--help';

  public registerCommand(command: Command): void {
    this.commands.set(command.getName(), command);
  }

  public async parseAndExecute(argv: string[]): Promise<void> {
    // Получаем аргументы командной строки (пропускаем node и путь к скрипту)
    const args = argv.slice(2);

    if (args.length === 0) {
      // Если аргументов нет, выполняем команду по умолчанию
      await this.executeCommand(this.defaultCommand);
      return;
    }

    const [commandName, ...params] = args;
    await this.executeCommand(commandName, ...params);
  }

  private async executeCommand(commandName: string, ...params: string[]): Promise<void> {
    const command = this.commands.get(commandName);

    if (!command) {
      console.error(`Неизвестная команда: ${commandName}`);
      console.log('Используйте --help для просмотра списка доступных команд');
      return;
    }

    await command.execute(...params);
  }
}
