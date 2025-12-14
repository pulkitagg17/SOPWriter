import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, truncateText } from '../formatters';

describe('formatters', () => {
    describe('formatCurrency', () => {
        it('should format Indian currency correctly', () => {
            expect(formatCurrency(1000)).toBe('₹1,000');
            expect(formatCurrency(2499)).toBe('₹2,499');
            expect(formatCurrency(100000)).toBe('₹1,00,000');
        });

        it('should handle zero', () => {
            expect(formatCurrency(0)).toBe('₹0');
        });

        it('should handle large numbers', () => {
            expect(formatCurrency(1000000)).toBe('₹10,00,000');
        });
    });

    describe('formatDate', () => {
        it('should format date to Indian locale', () => {
            const date = new Date('2024-12-14');
            const formatted = formatDate(date);
            expect(formatted).toContain('2024');
            expect(formatted).toContain('December');
            expect(formatted).toContain('14');
        });

        it('should handle string dates', () => {
            const formatted = formatDate('2024-12-14');
            expect(formatted).toContain('2024');
        });
    });

    describe('truncateText', () => {
        it('should truncate long text', () => {
            const longText = 'This is a very long text that should be truncated';
            expect(truncateText(longText, 20)).toBe('This is a very long ...');
        });

        it('should not truncate short text', () => {
            const shortText = 'Short text';
            expect(truncateText(shortText, 20)).toBe('Short text');
        });

        it('should handle exact length', () => {
            const text = 'Exactly twenty chars';
            expect(truncateText(text, 20)).toBe('Exactly twenty chars');
        });
    });
});
