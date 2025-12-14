---
description: Complete end-to-end testing and GitHub deployment workflow for SOPWriter project
---

# SOPWriter - Complete Testing & Deployment Workflow

This workflow covers all testing scenarios and the process to push code to GitHub main branch.

---

## 📋 Prerequisites Checklist

Before starting, ensure:
- [ ] MongoDB is running (for backend tests)
- [ ] Node.js v20.19.0+ is installed
- [ ] All dependencies are installed in both frontend and backend

---

## 🔧 Phase 1: Environment Setup

### 1.1 Install Dependencies

```bash
# Backend dependencies
cd sopwriter-backend
npm install

# Frontend dependencies
cd ../sopwriter-frontend
npm install
```

### 1.2 Environment Variables Check

Ensure `.env` files exist and are properly configured:
- `sopwriter-backend/.env` - MongoDB URI, SendGrid API Key, JWT secrets
- `sopwriter-frontend/.env` - API URL configuration

---

## 🧪 Phase 2: Backend Testing

### 2.1 Linting & Type Checking

```bash
cd sopwriter-backend

# Run ESLint to check code quality
// turbo
npm run lint

# Run TypeScript type checking
// turbo
npm run typecheck
```

### 2.2 Unit Tests

Unit tests cover individual components like models, services, and utilities.

**Current Unit Tests:**
- `lead.service.test.ts` - Lead service functionality
- `lead.model.test.ts` - Lead model validation
- `service.model.test.ts` - Service model validation
- `transaction.model.test.ts` - Transaction model validation
- `transaction.service.test.ts` - Transaction service functionality
- `mail.service.test.ts` - Email service functionality
- `globalsettings.model.test.ts` - Global settings model
- `errorHandler.test.ts` - Error handling middleware

```bash
# Run unit tests only
// turbo
npm run test:unit
```

### 2.3 Integration Tests

Integration tests cover API endpoints and full flows.

**Current Integration Tests:**
- `admin.auth.test.ts` - Admin authentication flows
- `admin.verify.test.ts` - Admin verification processes
- `admin.transactions.test.ts` - Admin transaction management
- `leads.flow.test.ts` - Lead creation and management flows
- `leads.errors.test.ts` - Lead error handling
- `transactions.flow.test.ts` - Transaction workflows
- `settings.flow.test.ts` - Settings management
- `config.flow.test.ts` - Configuration endpoints
- `full.flow.test.ts` - Complete user flows
- `rateLimit.test.ts` - Rate limiting functionality

```bash
# Run integration tests only
// turbo
npm run test:integration
```

### 2.4 Full Backend Test Suite with Coverage

```bash
# Run all tests with coverage report
// turbo
npm run test:coverage
```

**Expected Coverage Thresholds:**
- Branches: 65%+
- Functions: 70%+
- Lines: 70%+
- Statements: 70%+

---

## 🎨 Phase 3: Frontend Testing

### 3.1 Linting & Type Checking

```bash
cd sopwriter-frontend

# Run ESLint
// turbo
npm run lint

# Run TypeScript build check (includes type checking)
// turbo
npm run build
```

### 3.2 Unit Tests

**Current Frontend Tests:**
- `formatters.test.ts` - Utility formatters
- `paymentStatus.test.ts` - Payment status utilities
- `useClipboard.test.ts` - Clipboard hook functionality

```bash
# Run Vitest tests (if vitest is configured)
# Note: Add test script to package.json if not present
npx vitest run
```

---

## 🖥️ Phase 4: Manual Functional Testing

### 4.1 Start Development Servers

**Terminal 1 - Backend:**
```bash
cd sopwriter-backend
npm run dev
```
Backend runs at: `http://localhost:3000` (or configured port)

**Terminal 2 - Frontend:**
```bash
cd sopwriter-frontend
npm run dev
```
Frontend runs at: `http://localhost:5173` (Vite default)

### 4.2 User Flow Testing Scenarios

#### 🔹 Landing Page Tests
- [ ] Homepage loads correctly
- [ ] Hero section animations work
- [ ] Navigation links functional
- [ ] Responsive design on mobile/tablet/desktop

#### 🔹 Lead Creation Flow
- [ ] Step 1: Personal details form validation
- [ ] Step 2: Service selection works
- [ ] Step 3: Details submission successful
- [ ] Form validation shows appropriate errors
- [ ] Phone number validation (libphonenumber-js)

#### 🔹 Payment Flow
- [ ] Payment page displays correctly
- [ ] QR code displayed properly
- [ ] Payment instructions clear
- [ ] Transaction reference generation
- [ ] Clipboard copy functionality

#### 🔹 Admin Dashboard Tests
- [ ] Admin login works
- [ ] Dashboard loads with data
- [ ] Leads table displays correctly
- [ ] Lead details modal opens
- [ ] Transaction verification works
- [ ] Settings page accessible
- [ ] Logout functionality

#### 🔹 API Endpoint Tests (via Browser DevTools/Postman)
- [ ] GET /api/config - Returns services and settings
- [ ] POST /api/leads - Creates new lead
- [ ] GET /api/leads/:id - Retrieves lead
- [ ] POST /api/admin/login - Admin authentication
- [ ] GET /api/admin/leads - Returns all leads (authenticated)
- [ ] PATCH /api/admin/leads/:id/verify - Verify transaction

---

## 🔒 Phase 5: Security & Quality Checks

### 5.1 Security Audit

```bash
cd sopwriter-backend
npm audit

cd ../sopwriter-frontend
npm audit
```

### 5.2 Build Verification

```bash
# Backend build
cd sopwriter-backend
npm run build

# Frontend production build
cd ../sopwriter-frontend
npm run build
```

---

## 📤 Phase 6: Git Operations & Deployment

### 6.1 Pre-Commit Checks

```bash
cd e:\Pulkit Project\Pulkit Project Git\SOPWriter

# Check current status
git status

# Review changes
git diff
```

### 6.2 Stage Changes

```bash
# Stage all changes
git add .

# OR stage specific files
git add sopwriter-backend/
git add sopwriter-frontend/
```

### 6.3 Commit Changes

```bash
# Create a descriptive commit message
git commit -m "feat: complete testing and quality assurance

- All backend unit tests passing
- All backend integration tests passing
- Frontend lint and build successful
- Manual functional testing verified
- Security audit completed"
```

### 6.4 Push to GitHub

```bash
# Push to main branch
git push origin main
```

---

## ✅ Complete Testing Checklist

### Backend
- [ ] `npm run lint` - No linting errors
- [ ] `npm run typecheck` - No TypeScript errors
- [ ] `npm run test:unit` - All unit tests pass
- [ ] `npm run test:integration` - All integration tests pass
- [ ] `npm run test:coverage` - Coverage thresholds met
- [ ] `npm run build` - Production build succeeds
- [ ] `npm audit` - No critical vulnerabilities

### Frontend
- [ ] `npm run lint` - No linting errors
- [ ] `npm run build` - TypeScript and Vite build succeed
- [ ] Manual testing completed
- [ ] Responsive design verified

### Git & Deployment
- [ ] All changes staged
- [ ] Meaningful commit message written
- [ ] Pushed to main branch
- [ ] GitHub repository updated

---

## 🚨 Troubleshooting

### Common Issues

**MongoDB Connection Errors:**
```bash
# Ensure MongoDB is running
# Check MONGODB_URI in .env file
```

**Test Timeout Errors:**
```bash
# Tests have 30s timeout configured
# For slower machines, increase testTimeout in jest.config.cjs
```

**Port Already in Use:**
```bash
# Kill process on port
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Git Push Rejected:**
```bash
# Pull latest changes first
git pull origin main --rebase
git push origin main
```

---

## 📊 Summary

| Phase | Command | Expected Result |
|-------|---------|-----------------|
| Backend Lint | `npm run lint` | 0 errors |
| Backend Types | `npm run typecheck` | No errors |
| Backend Unit Tests | `npm run test:unit` | All pass |
| Backend Integration | `npm run test:integration` | All pass |
| Backend Coverage | `npm run test:coverage` | 65%+ branches |
| Backend Build | `npm run build` | Success |
| Frontend Lint | `npm run lint` | 0 errors |
| Frontend Build | `npm run build` | Success |
| Git Push | `git push origin main` | Success |

