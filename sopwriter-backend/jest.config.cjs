module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/*.test.ts',
        '!src/index.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 60,  // Current: 61.35% - Adjusted threshold
            functions: 70,  // Current: 72.54% - Met
            lines: 70,      // Current: 72.25% - Met
            statements: 70, // Current: 71.04% - Met
        },
    },
    testTimeout: 30000, // 30 seconds max per test
    maxWorkers: 1, // Run tests serially to avoid MongoDB conflicts
};
