import chalk from 'chalk';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { Command } from './command.interface.js';
import { TSVParser } from '../../shared/helpers/tsv-parser.js';
import { UserService } from '../../shared/modules/user/user-service.interface.js';
import { DefaultUserService } from '../../shared/modules/user/default-user.service.js';
import { OfferService } from '../../shared/modules/offer/offer-service.interface.js';
import { DefaultOfferService } from '../../shared/modules/offer/default-offer.service.js';
import { DatabaseClient } from '../../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo.database-client.js';
import { PinoLogger } from '../../shared/libs/logger/pino.logger.js';
import { UserModel } from '../../shared/modules/user/user.entity.js';
import { OfferModel } from '../../shared/modules/offer/offer.entity.js';
import { Offer } from '../../shared/types/offer.type.js';
import { getMongoURI } from '../../shared/helpers/database.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private readonly salt: string;

  constructor() {
    this.salt = process.env.SALT || 'secret'; // In real app, get from config

    // Manual DI for CLI command (since we don't have full container setup for CLI yet)
    const logger = new PinoLogger();
    this.databaseClient = new MongoDatabaseClient(logger);
    this.userService = new DefaultUserService(logger, UserModel);
    this.offerService = new DefaultOfferService(logger, OfferModel);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(...params: string[]): Promise<void> {
    const [filepath, user, password, host, dbname, salt] = params;

    if (!filepath) {
      console.error(chalk.red('Ошибка: не указан путь к файлу'));
      console.log(chalk.yellow('Использование: --import <path> [user] [password] [host] [dbname] [salt]'));
      return;
    }

    const uri = getMongoURI(
      user || process.env.DB_USER || 'admin',
      password || process.env.DB_PASSWORD || 'test',
      host || process.env.DB_HOST || 'localhost',
      process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 27017,
      dbname || process.env.DB_NAME || 'six-cities'
    );

    const saltValue = salt || this.salt;

    try {
      await this.databaseClient.connect(uri);

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
          continue;
        }

        // Пропускаем пустые строки
        if (!line.trim()) {
          continue;
        }

        const offer = TSVParser.parseOffer(line);

        if (offer) {
          await this.saveOffer(offer, saltValue);
          importedCount++;
          process.stdout.write('.');
        }
      }

      console.log(chalk.bold.green(`\n\n✓ Импорт завершён. Сохранено предложений: ${importedCount}\n`));
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'ENOENT') {
        console.error(chalk.red(`\nОшибка: файл "${filepath}" не найден\n`));
      } else {
        console.error(chalk.red('\nОшибка при импорте:'), error);
      }
      await this.databaseClient.disconnect();
      // eslint-disable-next-line unicorn/no-process-exit, node/no-process-exit, no-process-exit
      process.exit(1); // Exit with error code
    }

    await this.databaseClient.disconnect();
    // eslint-disable-next-line unicorn/no-process-exit, node/no-process-exit, no-process-exit
    process.exit(0); // Exit with success code
  }

  private async saveOffer(offer: Offer, salt: string) {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      avatarUrl: offer.author.avatarUrl || '', // Provide default empty string if undefined
      password: 'password' // Default password for imported users
    }, salt);

    await this.offerService.create({
      ...offer,
      hostId: user.id,
      postDate: new Date(offer.postDate)
    });
  }
}
