<p align="center">
  <img src="sopwriter-frontend/public/Hero.png" alt="SOP Writer" width="600"/>
</p>

<h1 align="center">📝 SOP Writer</h1>

<p align="center">
  <strong>Professional Statement of Purpose Writing Service Platform</strong>
</p>

<p align="center">
  A modern, full-stack web application for managing SOP writing services with lead management, payment processing, and comprehensive admin dashboard.
</p>

<p align="center">
  <a href="https://github.com/pulkitagg17/SOPWriter/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"/>
  </a>
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/badge/node-%3E%3D20.19.0-brightgreen.svg" alt="Node Version"/>
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/TypeScript-5.9-blue.svg" alt="TypeScript"/>
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/React-19.2-61dafb.svg" alt="React"/>
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/MongoDB-Mongoose_9-green.svg" alt="MongoDB"/>
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Test_Coverage-71%25-success.svg" alt="Test Coverage"/>
  </a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-testing">Testing</a>
</p>

---

## ✨ Features

### 🎯 Core Features

| Feature | Description |
|---------|-------------|
| **📋 Lead Management** | Capture and track customer inquiries with multi-step wizard |
| **💳 Payment Integration** | UPI-based payment system with QR code generation |
| **🔐 Admin Dashboard** | Comprehensive dashboard for lead and transaction management |
| **📧 Email Automation** | Automated notifications via SendGrid or SMTP |
| **📊 Transaction Tracking** | Full payment lifecycle management with verification |
| **⚙️ Dynamic Configuration** | Centralized settings for services, pricing, and contact info |

### 🛡️ Security Features

- 🔒 **JWT Authentication** with secure token refresh
- 🛡️ **Rate Limiting** to prevent abuse and DDoS attacks
- 🔐 **Password Hashing** with bcrypt
- ✅ **Input Validation** using Zod schemas
- 🪖 **Helmet.js** for secure HTTP headers
- 🌐 **CORS Protection** with configurable origins

### 🎨 Frontend Features

- ⚡ **Vite + React 19** for blazing fast development
- 🎭 **Framer Motion** animations for premium UX
- 📱 **Fully Responsive** mobile-first design
- 🌙 **Dark Mode** support with next-themes
- 🎨 **Tailwind CSS 4** for modern styling
- 🧩 **Radix UI** accessible component primitives

---

## 🏗️ Architecture

```
SOPWriter/
├── 📁 sopwriter-backend/           # Express.js API Server
│   ├── 📁 src/
│   │   ├── 📁 config/             # Configuration (DB, Env, Logger)
│   │   ├── 📁 constants/          # Application constants
│   │   ├── 📁 controllers/        # Request handlers
│   │   ├── 📁 middlewares/        # Auth, Rate Limiting, Error Handling
│   │   ├── 📁 models/             # MongoDB/Mongoose models
│   │   ├── 📁 routes/             # API routes (admin, public)
│   │   ├── 📁 services/           # Business logic layer
│   │   ├── 📁 tests/              # Unit & Integration tests
│   │   ├── 📁 types/              # TypeScript type definitions
│   │   └── 📁 utils/              # Helper utilities
│   ├── 📄 jest.config.cjs         # Jest configuration
│   ├── 📄 tsconfig.json           # TypeScript configuration
│   └── 📄 package.json
│
├── 📁 sopwriter-frontend/          # React + Vite Frontend
│   ├── 📁 src/
│   │   ├── 📁 app/                # App shell, routing, providers
│   │   ├── 📁 components/         # Legacy shared components
│   │   ├── 📁 contexts/           # React contexts
│   │   ├── 📁 core/               # Core utilities (API, auth, config)
│   │   ├── 📁 features/           # Feature modules
│   │   │   ├── 📁 admin/          # Admin dashboard, auth, settings
│   │   │   ├── 📁 home/           # Landing page components
│   │   │   ├── 📁 leads/          # Lead creation wizard
│   │   │   └── 📁 payment/        # Payment flow & verification
│   │   ├── 📁 shared/             # Shared components, hooks, utils
│   │   ├── 📁 styles/             # Global styles
│   │   └── 📁 types/              # TypeScript types
│   ├── 📄 vite.config.ts          # Vite configuration
│   └── 📄 package.json
│
└── 📄 README.md
```

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | ≥20.19.0 | Runtime environment |
| **Express.js** | 5.x | Web framework |
| **TypeScript** | 5.9 | Type safety |
| **MongoDB** | - | Database |
| **Mongoose** | 9.x | ODM |
| **Jest** | 30.x | Testing framework |
| **Zod** | 4.x | Schema validation |
| **Pino** | 10.x | Logging |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2 | UI library |
| **Vite** | 7.x | Build tool |
| **TypeScript** | 5.9 | Type safety |
| **Tailwind CSS** | 4.x | Styling |
| **Framer Motion** | 12.x | Animations |
| **Radix UI** | Latest | Accessible primitives |
| **React Router** | 7.x | Routing |
| **Axios** | 1.x | HTTP client |
| **Vitest** | 4.x | Testing |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20.19.0
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/pulkitagg17/SOPWriter.git
cd SOPWriter
```

### 2️⃣ Backend Setup

```bash
cd sopwriter-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration (see Environment Variables section)

# Start development server
npm run dev
```

**Backend runs at:** `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
cd sopwriter-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend runs at:** `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend (`sopwriter-backend/.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/sopwriter

# Authentication
JWT_SECRET=your-strong-jwt-secret-key-at-least-32-characters-long

# CORS & URLs
CORS_ORIGIN=http://localhost:5173
APP_BASE_URL=http://localhost:5173

# Email Configuration (SMTP)
MAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@sopwriter.com
ADMIN_NOTIFY_EMAIL=admin@sopwriter.com

# Email Configuration (SendGrid - Alternative)
SENDGRID_API_KEY=your-sendgrid-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
RATE_LIMIT_MAX_LEADS=10
RATE_LIMIT_MAX_TRANSACTIONS=20

# Admin Setup
ADMIN_EMAIL=admin@sopwriter.com
ADMIN_PASSWORD=Admin@SecureP@ssw0rd!ChangeMe

# Logging
LOG_LEVEL=info

# Default Settings
DEFAULT_CONTACT_PHONE=+91-XXXXXXXXXX
DEFAULT_WHATSAPP=+91XXXXXXXXXX
DEFAULT_CONTACT_EMAIL=contact@sopwriter.com
DEFAULT_SUPPORT_EMAIL=support@sopwriter.com
DEFAULT_UPI_ID=your-upi@bank
DEFAULT_QR_IMAGE=https://your-qr-code-url.png
```

---

## 📦 Available Scripts

### Backend

```bash
npm run dev              # Start dev server with hot reload
npm run build            # Compile TypeScript
npm start                # Run production build
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier
npm run typecheck        # TypeScript type checking
npm test                 # Run all tests
npm run test:unit        # Run unit tests only
npm run test:integration # Run integration tests only
npm run test:coverage    # Generate coverage report
npm run docker:dev       # Start with Docker Compose
```

### Frontend

```bash
npm run dev              # Start Vite dev server
npm run build            # TypeScript check + Vite build
npm run lint             # Run ESLint
npm run preview          # Preview production build
```

---

## 🧪 Testing

### Backend Test Suite

The backend includes comprehensive unit and integration tests:

```bash
cd sopwriter-backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit        # 48 unit tests
npm run test:integration # 60 integration tests
```

**Current Coverage:**

| Metric | Coverage |
|--------|----------|
| Statements | 71.04% |
| Branches | 61.35% |
| Functions | 72.54% |
| Lines | 72.25% |

### Test Files Overview

```
tests/
├── unit/
│   ├── lead.service.test.ts
│   ├── lead.model.test.ts
│   ├── transaction.model.test.ts
│   ├── transaction.service.test.ts
│   ├── service.model.test.ts
│   ├── globalsettings.model.test.ts
│   ├── mail.service.test.ts
│   └── errorHandler.test.ts
│
└── integration/
    ├── admin.auth.test.ts
    ├── admin.verify.test.ts
    ├── admin.transactions.test.ts
    ├── leads.flow.test.ts
    ├── leads.errors.test.ts
    ├── transactions.flow.test.ts
    ├── settings.flow.test.ts
    ├── config.flow.test.ts
    ├── full.flow.test.ts
    └── rateLimit.test.ts
```

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production:  https://your-domain.com/api
```

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/public/config` | Get services & settings |
| `POST` | `/public/leads` | Create new lead |
| `GET` | `/public/leads/:id` | Get lead by ID |
| `POST` | `/public/transactions` | Declare payment |

### Admin Endpoints (🔐 Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/admin/auth/login` | Admin login |
| `POST` | `/admin/auth/logout` | Admin logout |
| `POST` | `/admin/auth/refresh` | Refresh token |
| `POST` | `/admin/auth/forgot-password` | Request password reset |
| `POST` | `/admin/auth/reset-password` | Reset password |
| `GET` | `/admin/leads` | Get all leads (paginated) |
| `GET` | `/admin/leads/:id` | Get lead details |
| `PATCH` | `/admin/leads/:id/status` | Update lead status |
| `GET` | `/admin/transactions` | Get all transactions |
| `PATCH` | `/admin/transactions/:id/verify` | Verify transaction |
| `GET` | `/admin/settings` | Get admin settings |
| `PUT` | `/admin/settings` | Update settings |

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

## 🐳 Docker Deployment

### Development with Docker Compose

```bash
cd sopwriter-backend

# Start services (MongoDB + App)
npm run docker:dev

# Stop services
npm run docker:down
```

### Production Docker Build

```dockerfile
# Build the image
docker build -t sopwriter-backend .

# Run the container
docker run -p 5000:5000 --env-file .env sopwriter-backend
```

---

## 🔄 User Flows

### Lead Creation Flow

```
1. User visits landing page
2. Clicks "Get Started" → Wizard opens
3. Step 1: Select service category
4. Step 2: Choose specific service
5. Step 3: Fill personal details
6. Submit → Lead created → Redirect to payment
```

### Payment Flow

```
1. User views payment page with order details
2. Scans UPI QR code / copies UPI ID
3. Makes payment via preferred UPI app
4. Enters transaction reference number
5. Declares payment → Transaction created
6. Admin verifies → Lead status updated
7. User receives confirmation email
```

### Admin Flow

```
1. Admin logs in at /admin/login
2. Views dashboard with leads & transactions
3. Filters/searches leads
4. Opens lead details modal
5. Verifies pending transactions
6. Updates lead status
7. Manages settings (contact info, UPI, services)
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Style Guidelines

- Follow existing code patterns
- Use TypeScript strict mode
- Write meaningful commit messages (Conventional Commits)
- Add tests for new features
- Maintain test coverage > 70%

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

<p align="center">
  <strong>Yash Garg</strong> • <strong>Pulkit Aggarwal</strong><br/>
  <a href="https://github.com/yashcu">@yashcu</a> • <a href="https://github.com/pulkitagg17">@pulkitagg17</a>
</p>

---

## 📞 Support

- 📧 Email: support@sopwriter.com
- 🐛 Issues: [GitHub Issues](https://github.com/yashcu/SOPWriter/issues)

---

## 🗺️ Roadmap

- [x] Core lead management system
- [x] Payment integration with UPI
- [x] Admin dashboard
- [x] Email notifications
- [x] Comprehensive test suite
- [ ] Multi-language support
- [ ] PDF export for SOPs
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

---

<p align="center">
  <strong>Made with ❤️ by the SOP Writer Team</strong><br/>
  <sub>Last Updated: December 2025</sub>
</p>
