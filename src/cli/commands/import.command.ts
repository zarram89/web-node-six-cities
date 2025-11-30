import chalk from 'chalk';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { Command } from './command.interface.js';
import { TSVParser } from '../../shared/helpers/tsv-parser.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public async execute(...params: string[]): Promise<void> {
    const [filepath] = params;

    if (!filepath) {
      console.error(chalk.red('Ошибка: не указан путь к файлу'));
      console.log(chalk.yellow('Использование: --import <path>'));
      return;
    }

    try {
      console.log(chalk.cyan(`\nИмпорт данных из файла: ${filepath}\n`));

      const fileStream = createReadStream(filepath, { encoding: 'utf-8' });
      const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      let lineNumber = 0;
      let importedCount = 0;

      for await (const line of rl) {
        lineNumber++;

        // Пропускаем заголовок
        if (lineNumber === 1) {
          console.log(chalk.gray(`Строка ${lineNumber}: заголовок (пропущен)`));
          continue;
        }

        // Пропускаем пустые строки
        if (!line.trim()) {
          continue;
        }

        const offer = TSVParser.parseOffer(line);

        if (offer) {
          importedCount++;
          console.log(chalk.green(`\n✓ Предложение ${importedCount}:`));
          console.log(chalk.bold('  Название: ') + offer.title);
          console.log(`  Город: ${chalk.yellow(offer.city)}`);
          console.log(`  Тип: ${offer.type}`);
          console.log(`  Цена: ${chalk.bold.green(`${offer.price} ₽`)}`);
          console.log(`  Рейтинг: ${chalk.yellow('*'.repeat(Math.round(offer.rating)))} (${offer.rating})`);
          console.log(`  Комнат: ${offer.rooms}, Гостей: ${offer.guests}`);
          console.log(`  Удобства: ${offer.amenities.join(', ')}`);
          console.log(`  Автор: ${chalk.cyan(offer.author.name)} (${offer.author.email})`);
          console.log(`  Комментариев: ${offer.commentCount}`);
          console.log(`  Премиум: ${offer.isPremium ? chalk.green('✓') : chalk.gray('✗')}`);
        } else {
          console.log(chalk.red(`✗ Ошибка в строке ${lineNumber}`));
        }
      }

      console.log(chalk.bold.green(`\n\n✓ Импорт завершён. Обработано предложений: ${importedCount}\n`));
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'ENOENT') {
        console.error(chalk.red(`\nОшибка: файл "${filepath}" не найден\n`));
      } else {
        console.error(chalk.red('\nОшибка при импорте:'), error);
      }
    }
  }
}
