import { describe, it, expect } from 'vitest';
import { getPaymentStatusInfo, shouldShowPaymentDetails } from '../utils/paymentStatus';
import type { Lead } from '@/types/config';

describe('paymentStatus utils', () => {
    describe('getPaymentStatusInfo', () => {
        it('should return null for null lead', () => {
            expect(getPaymentStatusInfo(null)).toBeNull();
        });

        it('should return correct info for VERIFIED status', () => {
            const lead: Lead = {
                _id: '123',
                status: 'VERIFIED',
                service: 'SOP',
                name: 'Test',
                email: 'test@test.com',
                phone: '+1234567890',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const info = getPaymentStatusInfo(lead);

            expect(info).not.toBeNull();
            expect(info?.text).toBe('Payment Verified');
            expect(info?.showPaymentDetails).toBe(false);
        });

        it('should return correct info for PAYMENT_DECLARED status', () => {
            const lead: Lead = {
                _id: '123',
                status: 'PAYMENT_DECLARED',
                service: 'SOP',
                name: 'Test',
                email: 'test@test.com',
                phone: '+1234567890',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const info = getPaymentStatusInfo(lead);

            expect(info?.text).toBe('Payment Declared');
            expect(info?.showPaymentDetails).toBe(false);
        });

        it('should return correct info for NEW status', () => {
            const lead: Lead = {
                _id: '123',
                status: 'NEW',
                service: 'SOP',
                name: 'Test',
                email: 'test@test.com',
                phone: '+1234567890',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const info = getPaymentStatusInfo(lead);

            expect(info?.text).toBe('Payment Pending');
            expect(info?.showPaymentDetails).toBe(true);
        });

        it('should show payment details for REJECTED status', () => {
            const lead: Lead = {
                _id: '123',
                status: 'REJECTED',
                service: 'SOP',
                name: 'Test',
                email: 'test@test.com',
                phone: '+1234567890',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const info = getPaymentStatusInfo(lead);

            expect(info?.text).toBe('Payment Rejected');
            expect(info?.showPaymentDetails).toBe(true); // Allow retry
        });
    });

    describe('shouldShowPaymentDetails', () => {
        it('should return false for null lead', () => {
            expect(shouldShowPaymentDetails(null)).toBe(false);
        });

        it('should return true for NEW status', () => {
            const lead: Lead = {
                _id: '123',
                status: 'NEW',
                service: 'SOP',
                name: 'Test',
                email: 'test@test.com',
                phone: '+1234567890',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            expect(shouldShowPaymentDetails(lead)).toBe(true);
        });

        it('should return false for VERIFIED status', () => {
            const lead: Lead = {
                _id: '123',
                status: 'VERIFIED',
                service: 'SOP',
                name: 'Test',
                email: 'test@test.com',
                phone: '+1234567890',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            expect(shouldShowPaymentDetails(lead)).toBe(false);
        });
    });
});
