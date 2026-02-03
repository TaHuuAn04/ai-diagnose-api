# Phân Tích Code Repository: AI Diagnose API

## Trả Lời: Có, tôi có thể đọc được code Pull Request của repository này!

Đây là phân tích chi tiết về codebase để chứng minh khả năng đọc và hiểu code:

---

## 📋 Tổng Quan Dự Án

**Tên dự án:** AI Diagnose API  
**Framework:** NestJS (Node.js framework)  
**Ngôn ngữ:** TypeScript  
**Database:** PostgreSQL (sử dụng TypeORM)  
**Version:** 0.0.1

---

## 🏗️ Cấu Trúc Dự Án

### 1. **Applications (apps/)**
- **api/**: Main API service với RESTful endpoints
- **worker/**: Background job processing service

### 2. **Libraries (libs/)**
- **core/**: Core functionality và shared components
  - Decorators (cache, current-user, api-response, is-public)
  - DTOs (page-options, paginated-result, page-meta, page)
  - Exception handling
  - Interceptors
- **utils/**: Utility functions
  - Date utilities
  - String utilities

### 3. **Main API Components (apps/api/src/)**
- **common/**: Shared utilities
  - DTOs (update-or-delete.dto)
  - Guards (google.guard, jwt-auth.guard, microsoft.guard)
  - Constants (cache-key.constant)
  - Enums (event-name, auth-func, injection-token)
- **config/**: Configuration files
  - AI configuration (dify-ai.config)
  - Database configuration
- **core/**: Core business logic
  - Repository interfaces (generic, end-user, user)
- **infrastructure/**: Infrastructure layer
- **modules/**: Feature modules
- **types/**: TypeScript type definitions

---

## 🗄️ Database Schema (db.dbml)

### Các Bảng Chính:

1. **users**: Quản lý người dùng
   - Các trường: id, role, username, email
   - Unique constraints trên username và email

2. **platforms**: Các nền tảng tích hợp
   - Telegram, WhatsApp, Discord, etc.

3. **developer_apps**: Ứng dụng của developer
   - Liên kết với user và platform
   - Status: active, inactive, suspended

4. **bots**: Chatbot instances
   - Liên kết với AI và developer_app
   - Có identifier, token, và platform_bot_id
   - Tracking last_active_at

5. **ais**: AI models
   - Hỗ trợ GPT, Gemini
   - Có settings riêng biệt

6. **bot_features & ai_features**: 
   - Quản lý tính năng của bot và AI
   - Cấu hình linh hoạt với JSONB

7. **app_credentials**: Quản lý credentials
   - API keys, secrets, tokens
   - Liên kết với platform và app

---

## 🔧 Technical Stack

### Dependencies Chính:
- **@nestjs/**: Core framework packages
  - common, core, platform-express
  - swagger (API documentation)
  - typeorm (Database ORM)
  - bullmq (Job queue)
  - jwt, passport (Authentication)
  - axios (HTTP client)
  - cqrs (Command Query Responsibility Segregation)

- **AI/ML Integration:**
  - @google/generative-ai (Gemini AI)
  - @googleapis/calendar (Google Calendar)
  - @microsoft/microsoft-graph-client (Microsoft Graph)

- **Cloud Services:**
  - @aws-sdk/client-s3 (AWS S3)
  - @novu/node (Notification service)

- **Messaging Platforms:**
  - fb-messenger-bot-api (Facebook Messenger)
  - telegram (Telegram Bot)

- **Real-time Communication:**
  - livekit-server-sdk (WebRTC)

### Dev Dependencies:
- TypeScript 5.5.4
- ESLint + Prettier (Code formatting)
- Jest (Testing)

---

## 🚀 Main Entry Point (apps/api/src/main.ts)

### Cấu hình:
1. **CORS**: Enabled với origin: '*'
2. **Validation**: Global ValidationPipe với whitelist: true
3. **Swagger**: API documentation tại `/api` endpoint
4. **Authentication**: Bearer JWT tokens
5. **Cookies**: Cookie parser enabled
6. **Versioning**: API versioning enabled
7. **Transactions**: TypeORM transactional context initialized

### Port Configuration:
- API chạy trên port được định nghĩa trong `API_PORT` environment variable

---

## 🔐 Security Features

### Guards:
1. **JwtAuthGuard**: JWT authentication guard (global)
2. **GoogleGuard**: Google OAuth authentication
3. **MicrosoftGuard**: Microsoft OAuth authentication

### Authentication Strategy:
- passport-jwt
- passport-google-oauth20
- passport-local
- passport-microsoft

---

## 📦 Module Structure (apps/api/src/main.module.ts)

### Global Providers:
1. **CoreTransformInterceptor**: Transform responses
2. **ClassSerializerInterceptor**: Serialize class instances
   - Strategy: 'excludeAll'
   - excludeExtraneousValues: true
3. **JwtAuthGuard**: Global authentication guard

### Imports:
- ConfigsModule
- Infrastructure modules
- Feature modules

---

## 🛠️ Available Scripts (package.json)

### Build:
- `npm run build` - Build all
- `npm run build:api` - Build API only
- `npm run build:worker` - Build worker only

### Development:
- `npm run start:dev:api` - Start API in watch mode
- `npm run start:dev:worker` - Start worker in watch mode

### Database Migrations:
- `npm run dbm:api:generate` - Generate migration
- `npm run dbm:api:run` - Run migrations
- `npm run dbm:api:revert` - Revert last migration

### Testing:
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run test:cov` - Test coverage

### Code Quality:
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

---

## 🎯 Key Features

1. **Multi-tenant Bot Management**: Quản lý nhiều bot trên nhiều platform
2. **AI Integration**: Tích hợp với GPT và Gemini
3. **OAuth Authentication**: Google và Microsoft login
4. **Job Queue**: Background job processing với BullMQ
5. **File Storage**: AWS S3 integration
6. **Real-time Communication**: LiveKit integration
7. **Notification**: Novu integration
8. **Caching**: Redis caching với IORedis
9. **API Documentation**: Swagger/OpenAPI
10. **Database Transactions**: TypeORM transactional support

---

## 📝 Code Quality

### Configuration Files:
- **.eslintrc.js** & **eslint.config.mjs**: ESLint configuration
- **.prettierrc**: Prettier formatting rules
- **tsconfig.json**: TypeScript compiler options
- **nest-cli.json**: NestJS CLI configuration

### Testing Setup:
- Jest configuration trong package.json
- Test regex: `.*\\.spec\\.ts$`
- Coverage directory: `./coverage`

---

## 🐳 Docker Support

- **Dockerfile**: Container configuration
- **docker-compose.yml**: Multi-container setup
- **.dockerignore**: Files to exclude from Docker build

---

## ✅ Kết Luận

**VÂNG, tôi có thể đọc được code của repository này!** 

Đây là một dự án **AI Chatbot Platform** rất đầy đủ với:
- ✅ Architecture tốt (NestJS monorepo với apps và libs)
- ✅ Database schema được thiết kế rõ ràng
- ✅ Multi-platform bot support (Telegram, Facebook, Discord)
- ✅ AI integration (GPT, Gemini)
- ✅ Authentication & Authorization đầy đủ
- ✅ Job queue và background processing
- ✅ Cloud storage integration
- ✅ API documentation với Swagger
- ✅ Testing infrastructure
- ✅ Docker support

Dự án này được xây dựng để tạo và quản lý các chatbot AI trên nhiều platform khác nhau, với khả năng tích hợp nhiều AI model và các tính năng mở rộng.
