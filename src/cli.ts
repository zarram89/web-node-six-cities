#!/usr/bin/env node

import { CommandParser } from './cli/command-parser.js';
import { HelpCommand } from './cli/commands/help.command.js';
import { VersionCommand } from './cli/commands/version.command.js';
import { ImportCommand } from './cli/commands/import.command.js';
import { GenerateCommand } from './cli/commands/generate.command.js';

function bootstrap() {
  const parser = new CommandParser();

  // Регистрируем все команды
  parser.registerCommand(new HelpCommand());
  parser.registerCommand(new VersionCommand());
  parser.registerCommand(new ImportCommand());
  parser.registerCommand(new GenerateCommand());

  // Парсим и выполняем команду
  parser.parseAndExecute(process.argv);
}

bootstrap();
