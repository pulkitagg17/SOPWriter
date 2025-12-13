#!/usr/bin/env node

/**
 * CI/CD Pipeline Validation Script
 *
 * This script validates that all GitHub Actions workflows are properly configured
 * and will work correctly when pushed to GitHub.
 *
 * Usage: node .github/validate-pipeline.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m'
};

// Validation results
const results = {
    passed: [],
    warnings: [],
    failed: []
};

/**
 * Print colored output
 */
function print(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print section header
 */
function printHeader(title) {
    print('\n' + '='.repeat(70), 'blue');
    print(`  ${title}`, 'bold');
    print('='.repeat(70), 'blue');
}

/**
 * Check if file exists
 */
function checkFileExists(filePath, description) {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
        results.passed.push(`✅ ${description}: ${filePath}`);
        return true;
    } else {
        results.failed.push(`❌ ${description} not found: ${filePath}`);
        return false;
    }
}

/**
 * Validate YAML syntax (basic check)
 */
function validateYAML(filePath, isWorkflow = true) {
    const fullPath = path.join(__dirname, '..', filePath);
    try {
        const content = fs.readFileSync(fullPath, 'utf8');

        let allPassed = true;

        // Only check workflow-specific fields for actual workflow files
        if (isWorkflow) {
            const checks = [
                { test: /^\s*name:/m, message: 'Has name field' },
                { test: /^\s*on:/m, message: 'Has trigger (on:) field' },
                { test: /^\s*jobs:/m, message: 'Has jobs section' },
                { test: /\s+steps:/m, message: 'Has steps in jobs' },
            ];

            checks.forEach(check => {
                if (!check.test.test(content)) {
                    results.warnings.push(`⚠️  ${filePath}: Missing or malformed ${check.message}`);
                    allPassed = false;
                }
            });
        }

        // Check for common syntax errors in all YAML files
        const lines = content.split('\n');
        let syntaxPassed = true;
        lines.forEach((line, index) => {
            // Check for tabs (YAML should use spaces)
            if (line.includes('\t')) {
                results.failed.push(`❌ ${filePath}:${index + 1}: Contains tab character (use spaces)`);
                syntaxPassed = false;
            }
        });

        if (syntaxPassed && (!isWorkflow || allPassed)) {
            results.passed.push(`✅ ${filePath}: YAML syntax looks valid`);
        }
        return syntaxPassed;
    } catch (error) {
        results.failed.push(`❌ ${filePath}: Error reading file - ${error.message}`);
        return false;
    }
}

/**
 * Check package.json scripts
 */
function checkPackageScripts(packagePath, requiredScripts) {
    const fullPath = path.join(__dirname, '..', packagePath);

    if (!fs.existsSync(fullPath)) {
        results.failed.push(`❌ Package.json not found: ${packagePath}`);
        return false;
    }

    try {
        const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        const scripts = pkg.scripts || {};

        let allFound = true;
        requiredScripts.forEach(script => {
            if (scripts[script]) {
                results.passed.push(`✅ ${packagePath}: Has '${script}' script`);
            } else {
                results.failed.push(`❌ ${packagePath}: Missing required '${script}' script`);
                allFound = false;
            }
        });

        return allFound;
    } catch (error) {
        results.failed.push(`❌ ${packagePath}: Invalid JSON - ${error.message}`);
        return false;
    }
}

/**
 * Validate workflow triggers
 */
function validateWorkflowTriggers(filePath, expectedTriggers) {
    const fullPath = path.join(__dirname, '..', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');

    let allFound = true;
    expectedTriggers.forEach(trigger => {
        if (content.includes(trigger)) {
            results.passed.push(`✅ ${filePath}: Has '${trigger}' trigger`);
        } else {
            results.warnings.push(`⚠️  ${filePath}: Missing '${trigger}' trigger`);
            allFound = false;
        }
    });

    return allFound;
}

/**
 * Check GitHub Actions syntax
 */
function checkActionsVersions(filePath) {
    const fullPath = path.join(__dirname, '..', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Check for outdated action versions
    const actionPatterns = [
        { pattern: /actions\/checkout@v[0-3]/, recommended: 'actions/checkout@v4', current: /actions\/checkout@v(\d+)/ },
        { pattern: /actions\/setup-node@v[0-3]/, recommended: 'actions/setup-node@v4', current: /actions\/setup-node@v(\d+)/ },
    ];

    actionPatterns.forEach(({ pattern, recommended, current }) => {
        const match = content.match(current);
        if (match && pattern.test(content)) {
            results.warnings.push(`⚠️  ${filePath}: Consider updating to ${recommended}`);
        }
    });

    // Check if using latest major versions
    if (content.includes('@v4') || content.includes('@v5')) {
        results.passed.push(`✅ ${filePath}: Using recent action versions`);
    }
}

/**
 * Validate Node version consistency
 */
function checkNodeVersions() {
    const files = [
        'sopwriter-backend/package.json',
        'sopwriter-frontend/package.json',
    ];

    const nodeVersions = new Set();

    files.forEach(file => {
        const fullPath = path.join(__dirname, '..', file);
        if (fs.existsSync(fullPath)) {
            const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            if (pkg.engines && pkg.engines.node) {
                nodeVersions.add(pkg.engines.node);
            }
        }
    });

    if (nodeVersions.size <= 1) {
        results.passed.push(`✅ Node version consistency: All packages specify same version`);
    } else {
        results.warnings.push(`⚠️  Node version mismatch across packages: ${Array.from(nodeVersions).join(', ')}`);
    }
}

/**
 * Main validation function
 */
async function validatePipeline() {
    print('\n' + '🔍  CI/CD PIPELINE VALIDATION'.padStart(45), 'bold');
    print('SOPWriter Project\n', 'blue');

    // 1. Check workflow files exist
    printHeader('1. Checking Workflow Files');
    const workflows = [
        ['.github/workflows/ci.yml', 'Main CI/CD Pipeline'],
        ['.github/workflows/security.yml', 'Security Scanning'],
        ['.github/workflows/dependency-review.yml', 'Dependency Review'],
        ['.github/workflows/pr-automation.yml', 'PR Automation'],
        ['.github/workflows/release.yml', 'Release Pipeline'],
    ];

    workflows.forEach(([file, desc]) => checkFileExists(file, desc));

    // 2. Check supporting files
    printHeader('2. Checking Supporting Files');
    checkFileExists('.github/labeler.yml', 'Labeler Configuration');
    checkFileExists('.github/README.md', 'CI/CD Documentation');

    // 3. Validate YAML syntax
    printHeader('3. Validating YAML Syntax');
    workflows.forEach(([file]) => validateYAML(file, true)); // true = is workflow file
    validateYAML('.github/labeler.yml', false); // false = not a workflow file (config only)

    // 4. Check package.json scripts
    printHeader('4. Validating Package Scripts');
    checkPackageScripts('sopwriter-backend/package.json', [
        'lint',
        'typecheck',
        'test',
        'test:unit',
        'test:integration',
        'test:coverage',
        'build',
    ]);

    checkPackageScripts('sopwriter-frontend/package.json', [
        'lint',
        'build',
    ]);

    // 5. Validate workflow triggers
    printHeader('5. Validating Workflow Triggers');
    validateWorkflowTriggers('.github/workflows/ci.yml', ['push:', 'pull_request:']);
    validateWorkflowTriggers('.github/workflows/security.yml', ['push:', 'schedule:']);
    validateWorkflowTriggers('.github/workflows/pr-automation.yml', ['pull_request:']);
    validateWorkflowTriggers('.github/workflows/release.yml', ['tags:']);

    // 6. Check GitHub Actions versions
    printHeader('6. Checking GitHub Actions Versions');
    workflows.forEach(([file]) => checkActionsVersions(file));

    // 7. Check Node version consistency
    printHeader('7. Validating Node Version Consistency');
    checkNodeVersions();

    // 8. Check for required directories
    printHeader('8. Checking Project Structure');
    checkFileExists('sopwriter-backend/src', 'Backend source directory');
    checkFileExists('sopwriter-frontend/src', 'Frontend source directory');
    checkFileExists('sopwriter-backend/package.json', 'Backend package.json');
    checkFileExists('sopwriter-frontend/package.json', 'Frontend package.json');

    // 9. Check for lock files
    printHeader('9. Checking Lock Files (for npm ci)');
    checkFileExists('sopwriter-backend/package-lock.json', 'Backend lock file');
    checkFileExists('sopwriter-frontend/package-lock.json', 'Frontend lock file');

    // Print summary
    printHeader('VALIDATION SUMMARY');

    print(`\n✅ Passed: ${results.passed.length}`, 'green');
    print(`⚠️  Warnings: ${results.warnings.length}`, 'yellow');
    print(`❌ Failed: ${results.failed.length}`, 'red');

    if (results.failed.length > 0) {
        print('\n❌ FAILED CHECKS:', 'red');
        results.failed.forEach(msg => print(msg, 'red'));
    }

    if (results.warnings.length > 0) {
        print('\n⚠️  WARNINGS:', 'yellow');
        results.warnings.forEach(msg => print(msg, 'yellow'));
    }

    // Final verdict
    print('\n' + '='.repeat(70), 'blue');
    if (results.failed.length === 0) {
        print('✅ PIPELINE VALIDATION PASSED!', 'green');
        print('Your CI/CD pipeline is ready to use on GitHub.', 'green');
        print('\nNext steps:', 'blue');
        print('1. Commit and push your changes', 'reset');
        print('2. The workflows will run automatically', 'reset');
        print('3. Check the Actions tab on GitHub for results', 'reset');
    } else {
        print('❌ PIPELINE VALIDATION FAILED!', 'red');
        print('Please fix the issues above before pushing to GitHub.', 'red');
    }
    print('='.repeat(70) + '\n', 'blue');

    // Exit with appropriate code
    process.exit(results.failed.length > 0 ? 1 : 0);
}

// Run validation
validatePipeline().catch(error => {
    print(`\n❌ Validation error: ${error.message}`, 'red');
    process.exit(1);
});
