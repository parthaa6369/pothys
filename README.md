# Pothys Backend

A scalable microservices backend system built with NestJS and TypeScript for the Pothys platform.

## 🏗️ Architecture

This project follows a microservices architecture with the following services:

- **Identity Service** - Authentication, authorization, and user management
- **CMS Service** - Content management and data collection
- **Portfolio Service** - Portfolio and event management
- **Payment Service** - Payment processing and file management
- **Transaction Service** - Transaction handling and reporting

## 🚀 Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Package Manager**: PNPM
- **Containerization**: Docker & Docker Compose
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
pothys-backend/
├── apps/                    # Microservices
│   ├── identity-service/
│   ├── cms-service/
│   ├── portfolio-service/
│   ├── payment-service/
│   └── transaction-service/
├── libs/                    # Shared libraries
│   ├── auth/               # Authentication utilities
│   ├── config/             # Configuration management
│   ├── core/               # Core utilities
│   ├── db-base/            # Database base configurations
│   ├── logger/             # Logging utilities
│   └── swagger-base/       # API documentation
├── docker/                 # Docker configurations
└── k8s/                    # Kubernetes configurations
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- PNPM 8+
- Docker & Docker Compose
- PostgreSQL (if running locally)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd pothys-backend
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the infrastructure**

```bash
# Start PostgreSQL and pgAdmin
docker-compose up postgres pgadmin -d
```

5. **Build shared libraries**

```bash
pnpm run build:libs
```

### Running Services

```bash
# Start all services
pnpm run start:all

# Start individual services
pnpm run start:identity-service
pnpm run start:cms-service
pnpm run start:portfolio-service
pnpm run start:payment-service
pnpm run start:transaction-service
```

## 🧪 Testing

```bash
# Run unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:cov
```

## 📝 Code Quality

This project uses automated code quality tools:

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git pre-commit hooks
- **lint-staged** - Run linters on staged files

### Manual formatting and linting

```bash
# Format code
pnpm run format

# Lint and fix
pnpm run lint
```

## 🗄️ Database

### Migrations

```bash
# Run migrations for a specific service
cd apps/identity-service
pnpm run migration:run
```

### Database Access

- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:8080
  - Email: admin@pothys.com
  - Password: admin

## 🐳 Docker

### Development

```bash
# Start all services in development mode
docker-compose up

# Start specific service
docker-compose up identity-service
```

### Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production stack
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 API Documentation

Once services are running, API documentation is available at:

- Identity Service: http://localhost:3001/api
- CMS Service: http://localhost:3002/api
- Portfolio Service: http://localhost:3003/api
- Payment Service: http://localhost:3004/api
- Transaction Service: http://localhost:3005/api

## 🔒 Environment Variables

Key environment variables:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=pothys
DB_PASS=password

# Application
NODE_ENV=development
JWT_SECRET=your-jwt-secret

# External Services
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
```

## 🚀 Deployment

### Kubernetes

```bash
# Apply Kubernetes configurations
kubectl apply -f k8s/
```

### CI/CD

This project includes Jenkins pipeline configuration for automated deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

### Git Workflow

The project uses Husky for pre-commit hooks that automatically:

- Run ESLint and fix issues
- Format code with Prettier
- Ensure tests pass

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Author**: Riyaz Ahmed
- **Project**: Pothys Backend

## 📞 Support

For support and questions, please contact the development team.

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
