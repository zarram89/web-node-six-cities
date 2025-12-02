# Как работать над проектом

## Окружение

Для удобства работы над проектом используются инструменты из **Node.js** и **npm**. Все необходимые настройки произведены. Убедитесь, что на рабочем компьютере установлен актуальный LTS релиз Node.js**. Актуальная версия **Node.js** указана в файле `package.json` в поле `node`. Затем, в терминале, перейдите в директорию с проектом и _единожды_ запустите команду:

```bash
npm install
```

Команда запустит процесс установки зависимостей проекта из **npm**.

> **Важно**: Если вы клонировали проект и получаете ошибку `This syntax requires an imported helper but module 'tslib' cannot be found` при запуске CLI команд, установите `tslib`:
> ```bash
> npm install tslib
> ```
> Этот пакет требуется для корректной работы async/await синтаксиса в TypeScript при включенной опции `importHelpers` в `tsconfig.json`.

### Сценарии

В `package.json` предопределено несколько сценариев.

#### Скомпилировать проект

```bash
npm run compile
```

Создаст директорию `dist` и скомпилирует проект.

#### Удалить скомпилированный проект

```bash
npm run clean
```

Удаляет директорию `dist`. Используется перед компиляцией.

#### Собрать проект

```bash
npm run build
```

Выполняет сборку проекта: удаляет ранее скомпилированный проект и компилирует заново.

#### Проверить линтером

```bash
npm run lint
```

Запуск проверки проекта статическим анализатором кода **ESLint**.

Линтер проверяет файлы только внутри директории `src`.

**Обратите внимание**, при запуске данной команды, ошибки выводятся в терминал.

#### Запустить ts-модуль без компиляции

```bash
npm run ts -- <Путь к модулю с ts-кодом>
```

Пакет `ts-node` позволяет выполнить TS-код в Node.js без предварительной компиляции. Используется только на этапе разработки.

#### Запустить CLI

```bash
npm run cli
```

Запускает CLI приложение. По умолчанию показывает справку (--help).

#### Команды CLI

##### --help

```bash
npm run cli -- --help
```

Выводит список всех доступных команд с описанием.

##### --version

```bash
npm run cli -- --version
```

Выводит версию приложения из `package.json`.

##### --import <path>

```bash
npm run cli -- --import ./mocks/offers.tsv
```

Импортирует данные из TSV-файла. Выводит информацию о каждом импортированном предложении в консоль.

##### --generate <n> <filepath> <url>

```bash
npm run cli -- --generate 100 ./mocks/test-data.tsv http://localhost:3123/db
```

Генерирует `<n>` тестовых предложений и сохраняет их в TSV файл. Данные для генерации берутся с мок-сервера по указанному URL.

#### Запустить мок-сервер

```bash
npm run server
```

Запускает JSON-сервер с тестовыми данными на порту 3123. Сервер предоставляет эндпоинт `/db` с моковыми данными для генератора.

#### Запустить проект (development режим)

```bash
npm run dev:start
```

Компилирует и запускает приложение с форматированным выводом логов через `pino-pretty`.

### База данных (MongoDB)

#### Запустить MongoDB через Docker

Перед первым запуском убедитесь, что Docker Desktop запущен.

```bash
docker compose up -d
```
npm run ts ./src/main.cli.ts -- --import ./mocks/mock-data.tsv admin test localhost 27017 six-cities secret
```

#### Остановить MongoDB контейнеры

```bash
docker compose down
```

#### Проверить статус контейнеров

```bash
docker ps
```

#### Запустить проект

```bash
npm start
```

В процессе запуска проекта будет выполнен процесс «Сборки проекта» и запуска результирующего кода.

### Модуль 5: Open API Спецификация

#### Просмотр спецификации

Спецификация API расположена в `specification/specification.yml`

**Просмотр через OpenAPI Editor в VS Code:**
1. Откройте файл `specification/specification.yml`
2. Нажмите `Ctrl+Shift+P` → `OpenAPI: Show Preview`

**Основные эндпоинты:**
- `/users/*` - Операции с пользователями (регистрация, логин, аватары)
- `/offers/*` - Операции с предложениями (CRUD, избранное, премиум)
- `/comments/*` - Операции с комментариями

**Безопасность:** Bearer token (JWT) для защищенных эндпоинтов

### Модуль 5. Задание 2: Реализация сервисов

**Цель:** Завершить разработку сервисов для работы с MongoDB

**Созданные модули:**
- Comment (новый): `src/shared/modules/comment/`
- Offer (расширен): +10 методов (CRUD, избранное, автоматика)
- User (расширен): +3 метода (findById, updateById, exists)

**Ключевые файлы:**
- `comment.entity.ts` - сущность Comment с валидацией
- `default-comment.service.ts` - сервис с авто обновлением
- `default-offer.service.ts` - 12 методов для работы с предложениями
- `default-user.service.ts` - 6 методов для работы с пользователями

**Автоматические вычисления:**
- `commentCount` - атомарный $inc при создании комментария
- `rating` - MongoDB aggregation ($avg) при каждом комментарии

---

## Module 7 Task 2: Document Existence Middleware и File Upload

### Цель

Реализовать универсальную middleware для проверки существования документов и систему загрузки файлов.

### Шаги выполнения

#### 1. Установка зависимостей

```bash
npm install multer mime-types nanoid
npm install -D @types/multer @types/mime-types
```

#### 2. DocumentExistsMiddleware

**Создать:**
- `src/shared/libs/rest/middleware/document-exists.middleware.ts`
- Интерфейс `DocumentExists` с методом `exists(id: string): Promise<boolean>`
- Middleware класс, принимающий сервис, имя сущности и имя параметра

**Применить к маршрутам:**
- OfferController: `GET/PATCH/DELETE /:offerId`
- CommentController: `GET/POST /:offerId`
- UserController: `POST /:userId/avatar`

**Порядок middleware:**
```
ValidateObjectId → DocumentExists → ValidateDto/UploadFile
```

#### 3. File Upload Infrastructure

**Обновить конфигурацию:**
```typescript
// rest.schema.ts
UPLOAD_DIRECTORY: 'upload'
STATIC_DIRECTORY_PATH: '/static'
HOST: 'localhost'
```

**Обновить .gitignore:**
```
upload/
static/
```

**Создать .env.example:**
```env
UPLOAD_DIRECTORY=upload
STATIC_DIRECTORY_PATH=/static
HOST=localhost
```

#### 4. UploadFileMiddleware

**Создать `src/shared/libs/rest/middleware/upload-file.middleware.ts`:**
- Использовать `multer.diskStorage`
- Генерировать имена файлов через `nanoid()`
- Определять расширения через `mime-types.extension()`

#### 5. Static File Serving

**Обновить `src/rest/rest.application.ts`:**
```typescript
this.server.use(
  this.config.get('STATIC_DIRECTORY_PATH'),
  express.static(this.config.get('UPLOAD_DIRECTORY'))
);
```

#### 6. Avatar Upload

**Создать:**
- `src/shared/modules/user/dto/update-user.dto.ts`

**Обновить UserController:**
- Добавить middleware chain для `/:userId/avatar`
- Реализовать обработчик `uploadAvatar`

**Цепочка middleware:**
```typescript
[
  ValidateObjectIdMiddleware,
  DocumentExistsMiddleware,
  UploadFileMiddleware
]
```

#### 7. Cleanup

Удалить дублирующиеся проверки существования из:
- `offer.controller.ts` (show, update, delete)
- `comment.controller.ts` (index, create)

Удалить неиспользуемые импорты `HttpError`, `StatusCodes`.

#### 8. Тестирование

**Создать `test.http`** с примерами:
- Загрузка аватара
- Тест DocumentExistsMiddleware (404/400)
- Тест порядка middleware
- Доступ к статическим файлам

**Запустить тесты:**
```bash
# Создать директорию
mkdir upload

# Запустить сервер
npm run dev:start

# Тестовые запросы из test.http
```

### Результат

**Файлы:**
- ✅ `document-exists.middleware.ts` - универсальная проверка
- ✅ `upload-file.middleware.ts` - загрузка с multer
- ✅ `update-user.dto.ts` - DTO для обновления
- ✅ `test.http` - тестовые запросы
- ✅ `.env.example` обновлен

**Изменения:**
- ✅ Middleware применены ко всем контроллерам
- ✅ Удалено ~50 строк дублирующегося кода
- ✅ express.static подключен
- ✅ upload/ и static/ в .gitignore

**Проверка:**
- ✅ Загрузка файлов работает
- ✅ Файлы доступны через /static/
- ✅ 404 при несуществующем документе
- ✅ 400 при невалидном ID
- ✅ Правильный порядок middleware

---

## Модуль 8. Задание 1: Авторизация (JWT)

### Конфигурация

В `.env` файле должны быть заданы следующие переменные:
```env
JWT_SECRET=secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRES_IN=2d
```

### Использование API с авторизацией

Для доступа к защищенным маршрутам необходимо передавать токен в заголовке `Authorization`:

```
Authorization: Bearer <token>
```

**Получение токена:**
Токен возвращается при успешном входе (`POST /users/login`) или регистрации (если реализовано).

**Пример запроса с curl:**
```bash
curl -X POST http://localhost:4000/offers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..." \
  -H "Content-Type: application/json" \
  -d '{"title": "New Offer", ...}'
```

### Избранное

Управление избранным доступно только авторизованным пользователям:
- `GET /offers/favorites` - получить список избранного
- `POST /offers/:offerId/favorite` - добавить в избранное
- `DELETE /offers/:offerId/favorite` - удалить из избранного

---

## Модуль 9. Задание 1: Finalizing REST API

### CORS

API поддерживает Cross-Origin Resource Sharing. Заголовки CORS устанавливаются автоматически для всех ответов.

### Контроль доступа

**Logout:**
Эндпоинт `POST /users/logout` теперь требует наличия валидного JWT токена.

**Управление предложениями:**
Редактирование (`PATCH`) и удаление (`DELETE`) предложений доступно **только автору** предложения.
- Если пользователь пытается изменить чужое предложение, сервер вернет `403 Forbidden`.

### Премиальные предложения

Доступен эндпоинт для получения премиальных предложений по городу:
- `GET /offers/premium/:city`

---

## Структура проекта

### Директория `src`

Исходный код проекта: компоненты, модули и так далее. Структура директории `src` может быть произвольной.

### Файл `Readme.md`

Инструкции по работе с учебным репозиторием.

### Файл `Contributing.md`

Советы и инструкции по внесению изменений в учебный репозиторий.

### Остальное

Все остальные файлы в проекте являются служебными. Пожалуйста, не удаляйте и не изменяйте их самовольно. Только если того требует задание или наставник.
