# CI/CD Workflows for SOP Writer

This directory contains GitHub Actions workflows for the SOP Writer project.

## 📋 Available Workflows

### 1. Backend CI/CD Pipeline (`backend-ci.yml`)

Main pipeline that runs on every push and pull request to the backend code.

**Triggers:**
- Push to `main` or `develop` branches (when backend files change)
- Pull requests to `main` or `develop` branches (when backend files change)

**Jobs:**

1. **Lint & Type Check**
   - Runs ESLint to find code quality issues
   - Checks TypeScript types
   - Validates code formatting with Prettier

2. **Run Tests** (Matrix: Node 18 & 20)
   - Unit tests
   - Integration tests
   - Coverage report (uploaded to Codecov)

3. **Build Application**
   - Compiles TypeScript to JavaScript
   - Creates production-ready build artifacts

4. **Security Audit**
   - Runs npm audit for dependency vulnerabilities
   - CodeQL static analysis

5. **Deploy to Production** (main branch only)
   - Downloads build artifacts
   - Deploys to production environment
   - *Note: Configure your deployment target*

6. **Notification**
   - Reports overall pipeline status

### 2. CodeQL Security Analysis (`codeql-analysis.yml`)

Automated security vulnerability scanning.

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Weekly schedule (every Monday at midnight)

### 3. Dependency Review (`dependency-review.yml`)

Reviews dependency changes in pull requests.

**Triggers:**
- Pull requests that modify `package.json` or `package-lock.json`

**Features:**
- Checks for known vulnerabilities
- Fails on moderate+ severity issues
- Posts summary comment on PRs

## 🚀 Getting Started

### Prerequisites

1. **Required Secrets** (for deployment):
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add the following secrets based on your deployment platform:

   **For Render:**
   ```
   RENDER_SERVICE_ID
   RENDER_API_KEY
   ```

   **For Heroku:**
   ```
   HEROKU_API_KEY
   HEROKU_APP_NAME
   HEROKU_EMAIL
   ```

   **For Codecov (optional):**
   ```
   CODECOV_TOKEN
   ```

2. **Environment Setup:**
   - Create a `production` environment in GitHub:
     - Go to Settings → Environments → New environment
     - Name it `production`
     - Add protection rules if needed

### Enabling Workflows

The workflows are automatically enabled once you push this `.github` directory to your repository.

### Manual Trigger

You can manually trigger workflows from the GitHub Actions tab in your repository.

## 📊 Workflow Status Badges

Add these badges to your README:

```markdown
[![Backend CI/CD](https://github.com/YOUR_USERNAME/SOPWriter/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/SOPWriter/actions/workflows/backend-ci.yml)
[![CodeQL](https://github.com/YOUR_USERNAME/SOPWriter/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/YOUR_USERNAME/SOPWriter/actions/workflows/codeql-analysis.yml)
```

## 🔧 Customization

### Changing Node.js Versions

Edit the `matrix.node-version` in `backend-ci.yml`:

```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]  # Add or remove versions
```

### Adding Environment Variables

Add environment variables to specific jobs:

```yaml
- name: Run tests
  working-directory: sopwriter-backend
  run: npm test
  env:
    NODE_ENV: test
    DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
```

### Configuring Deployment

Uncomment and configure the deployment step in `backend-ci.yml`:

**For Render:**
```yaml
- name: Deploy to Render
  uses: johnbeynon/render-deploy-action@v0.0.8
  with:
    service-id: ${{ secrets.RENDER_SERVICE_ID }}
    api-key: ${{ secrets.RENDER_API_KEY }}
```

**For Heroku:**
```yaml
- name: Deploy to Heroku
  uses: akhileshns/heroku-deploy@v3.13.15
  with:
    heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
    heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
    heroku_email: ${{ secrets.HEROKU_EMAIL }}
    appdir: sopwriter-backend
```

## 📝 Best Practices

1. **Always test locally first:**
   ```bash
   cd sopwriter-backend
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```

2. **Use feature branches:**
   - Create feature branches for new work
   - Open PRs to trigger CI checks before merging

3. **Monitor the Actions tab:**
   - Check workflow runs regularly
   - Review failed builds promptly

4. **Keep dependencies updated:**
   - Review Dependabot PRs
   - Check dependency review comments

## 🐛 Troubleshooting

### Workflow not triggering?

1. Ensure the workflow file is in `.github/workflows/`
2. Check the file has `.yml` extension
3. Verify the trigger paths match your changes
4. Check branch protection rules

### Build failing?

1. Check the Actions tab for detailed error logs
2. Test locally with the same Node version
3. Verify all environment variables are set
4. Check for missing dependencies

### Tests failing in CI but passing locally?

1. Ensure test database is properly configured
2. Check for environment-specific issues
3. Verify timezone/locale settings
4. Look for race conditions in tests

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Dependency Review](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review)
