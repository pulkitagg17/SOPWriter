# 📝 SOP Writer

> A powerful Standard Operating Procedure (SOP) generation platform with AI capabilities, email automation, and payment integration.

[![CI/CD Pipeline](https://github.com/pulkitagg17/SOPWriter/actions/workflows/ci.yml/badge.svg)](https://github.com/pulkitagg17/SOPWriter/actions/workflows/ci.yml)
[![Security Scanning](https://github.com/pulkitagg17/SOPWriter/actions/workflows/security.yml/badge.svg)](https://github.com/pulkitagg17/SOPWriter/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.19.0-brightgreen)](https://nodejs.org)

---

## 🌟 Features

### Core Features
- ✨ **AI-Powered SOP Generation** - Automated creation of professional SOPs
- 📧 **Email Automation** - Integrated email service with SendGrid & Nodemailer
- 💳 **Payment Integration** - Secure payment processing and transaction management
- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 📊 **Lead Management** - Track and manage customer leads
- ⚙️ **Global Settings** - Centralized configuration management
- 🎨 **Multi-Service Support** - Handle multiple service offerings

### Technical Features
- 🚀 **RESTful API** - Clean, well-documented REST endpoints
- 🔒 **Security First** - Helmet.js, rate limiting, CORS protection
- 📝 **TypeScript** - Full type safety and better developer experience
- 🧪 **Comprehensive Testing** - Unit and integration tests with >70% coverage
- 🐳 **Docker Ready** - Containerized deployment support
- ⚡ **CI/CD Pipeline** - Automated testing and deployment with GitHub Actions
- 📖 **API Documentation** - OpenAPI/Swagger documentation

---

## 🏗️ Project Structure

```
SOPWriter/
├── .github/                    # GitHub Actions workflows
│   ├── workflows/
│   │   ├── ci.yml             # Main CI/CD pipeline (backend + frontend)
│   │   ├── security.yml       # Security scanning (CodeQL, dependency audit)
│   │   ├── dependency-review.yml # Dependency vulnerability checks
│   │   ├── pr-automation.yml  # PR labeling and automation
│   │   └── release.yml        # Automated release pipeline
│   ├── README.md              # CI/CD documentation
│   └── CI_CD_QUICK_REF.md    # Quick reference guide
├── sopwriter-backend/          # Backend API service
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/        # Request handlers
│   │   ├── middlewares/        # Custom middlewares
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── tests/             # Test suites
│   │   └── app.ts             # Express app setup
│   ├── package.json
│   └── tsconfig.json
├── sopwriter-frontend/         # Frontend application
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 20.19.0 ([Download](https://nodejs.org))
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pulkitagg17/SOPWriter.git
   cd SOPWriter
   ```

2. **Setup Backend**
   ```bash
   cd sopwriter-backend

   # Install dependencies
   npm install

   # Copy environment variables
   cp .env.example .env

   # Edit .env with your configuration
   # Add MongoDB URI, JWT secrets, SendGrid API key, etc.
   ```

3. **Configure Environment Variables**

   Edit `sopwriter-backend/.env`:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/sopwriter

   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d

   # Email (SendGrid)
   SENDGRID_API_KEY=your-sendgrid-api-key
   FROM_EMAIL=noreply@yourapp.com

   # Payment
   PAYMENT_GATEWAY_KEY=your-payment-key

   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

---

## 📦 Available Scripts

### Backend

```bash
# Development
npm run dev              # Start dev server with hot reload

# Building
npm run build            # Compile TypeScript to JavaScript
npm start                # Run production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run typecheck        # TypeScript type checking

# Testing
npm test                 # Run all tests
npm run test:unit        # Run unit tests only
npm run test:integration # Run integration tests only
npm run test:coverage    # Generate coverage report
npm run test:watch       # Run tests in watch mode
npm run test:ci          # Run tests for CI/CD

# Database
npm run seed             # Seed database with sample data

# Docker
npm run docker:dev       # Start services with Docker Compose
npm run docker:down      # Stop Docker services
```

---

## 🧪 Testing

### Running Tests Locally

```bash
cd sopwriter-backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### Test Coverage

Current test coverage: **>70%**

Coverage reports are generated in `sopwriter-backend/coverage/`

---

## 🔧 API Documentation

### Base URL
```
Development: http://localhost:5000
Production: https://your-production-url.com
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/refresh` | Refresh token | ✅ |
| POST | `/api/auth/logout` | User logout | ✅ |

### Lead Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/public/leads` | Create new lead | ❌ |
| GET | `/api/admin/leads` | Get all leads | ✅ Admin |
| GET | `/api/admin/leads/:id` | Get lead by ID | ✅ Admin |

### Settings & Configuration

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/public/config` | Get public config | ❌ |
| PUT | `/api/admin/settings` | Update settings | ✅ Admin |

### Transactions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/transactions` | Create transaction | ✅ |
| GET | `/api/transactions/:id` | Get transaction | ✅ |

---

## 🔐 Security Features

- 🛡️ **Helmet.js** - Secure HTTP headers
- 🚦 **Rate Limiting** - Prevent abuse and DDoS
- 🔒 **CORS** - Cross-Origin Resource Sharing protection
- 🔑 **JWT Authentication** - Secure token-based auth
- ✅ **Input Validation** - Zod schema validation
- 🔐 **Password Hashing** - bcrypt encryption
- 🔍 **Security Scanning** - Automated CodeQL analysis

---

## 🚢 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

1. **Build the application**
   ```bash
   cd sopwriter-backend
   npm run build
   ```

2. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export MONGODB_URI=your-production-mongodb-uri
   # ... other env vars
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Platform-Specific Deployments

- **Render**: See [CI_CD_SETUP.md](.github/README.md)
- **Heroku**: Uncomment Heroku deploy step in `.github/workflows/backend-ci.yml`
- **AWS/Azure**: Use Docker deployment method

---

## 🤖 CI/CD Pipeline

This project uses a modern, automated CI/CD pipeline with GitHub Actions.

### 📋 Pipeline Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Main CI/CD Pipeline                       │
├─────────────────────────────────────────────────────────────┤
│  Backend          │  Frontend         │  Deployment         │
│  ├─ Lint          │  ├─ Lint          │  └─ Production      │
│  ├─ Type Check    │  ├─ Type Check    │     (main only)     │
│  ├─ Tests (20,22) │  └─ Build         │                     │
│  ├─ Coverage      │                   │                     │
│  ├─ Build         │                   │                     │
│  └─ Security      │                   │                     │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 Workflows

1. **Main CI/CD** (`ci.yml`) - Runs on every push/PR
   - ✅ Parallel backend & frontend testing
   - ✅ Matrix testing (Node 20, 22)
   - ✅ Code coverage reporting
   - ✅ Build artifact generation
   - ✅ Automated deployment on `main`

2. **Security Scanning** (`security.yml`) - Weekly + on-demand
   - 🔐 CodeQL analysis (separate backend/frontend)
   - 🔍 Dependency vulnerability scanning
   - 🔐 Secret detection with TruffleHog

3. **Dependency Review** (`dependency-review.yml`) - On dependency PRs
   - 📦 Vulnerability checks on new dependencies
   - ⚠️ Fails PRs with moderate+ severity issues

4. **PR Automation** (`pr-automation.yml`) - On all PRs
   - 🏷️ Auto-labeling based on files changed
   - 📏 Size calculation (XS to XL)
   - 👋 Welcome comments with checklist
   - 📝 Conventional commit validation

5. **Release Pipeline** (`release.yml`) - On version tags
   - 📦 Automated artifact packaging
   - 📝 Changelog generation
   - 🎉 GitHub release creation
   - 🐳 Docker image publishing (optional)

### ⚡ Quick Start

Run checks locally before pushing:
```bash
# Backend
cd sopwriter-backend
npm run lint && npm run typecheck && npm test

# Frontend
cd sopwriter-frontend
npm run lint && npm run build
```

### 📚 Documentation

- **Full Guide**: [.github/README.md](.github/README.md)
- **Quick Reference**: [.github/CI_CD_QUICK_REF.md](.github/CI_CD_QUICK_REF.md)

### 🔒 Security

- ✅ Weekly CodeQL scans
- ✅ Automated dependency audits
- ✅ Secret scanning on commits
- ✅ All scans visible in GitHub Security tab

---

## 📚 Documentation

- [CI/CD Setup Guide](CI_CD_SETUP.md)
- [Local Testing Guide](LOCAL_CI_TESTING.md)
- [Security Audit Report](SECURITY_AUDIT_REPORT.md)
- [White Label Guide](WHITE_LABEL_GUIDE.md)
- [Security For Clients](SECURITY_FOR_CLIENTS.md)
- [Hardcoded Values Audit](HARDCODED_VALUES_AUDIT.md)
- [Project Completion Report](PROJECT_COMPLETE.md)

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (>=20.19.0)
- **Framework**: Express.js v5
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Email**: SendGrid & Nodemailer
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS, bcrypt, express-rate-limit

### DevOps
- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Code Quality**: ESLint, Prettier
- **Security Scanning**: CodeQL, npm audit

---

## 🔄 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

3. **Run tests locally**
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - CI/CD will run automatically
   - Address any review comments
   - Merge when approved

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Style

- Follow existing code style
- Use TypeScript strict mode
- Write meaningful commit messages
- Add JSDoc comments for functions
- Maintain test coverage >70%

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Pulkit Aggarwal** ([@pulkitagg17](https://github.com/pulkitagg17))

---

## 🙏 Acknowledgments

- Thanks to all contributors
- Built with ❤️ using modern web technologies

---

## 📞 Support

For support, email support@yourapp.com or open an issue on GitHub.

---

## 🗺️ Roadmap

- [ ] Frontend application enhancement
- [ ] Advanced SOP templates
- [ ] Multi-language support
- [ ] Export to PDF/Word
- [ ] Real-time collaboration
- [ ] Analytics dashboard
- [ ] Mobile app

---

## 📊 Project Status

✅ **Active Development** - Regularly maintained and updated

Last Updated: December 2025

---

<p align="center">Made with ❤️ by the SOP Writer Team</p>
