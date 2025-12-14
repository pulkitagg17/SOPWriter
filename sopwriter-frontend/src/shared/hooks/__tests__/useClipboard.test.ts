import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClipboard } from '../useClipboard';

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock clipboard API
beforeEach(() => {
    Object.assign(navigator, {
        clipboard: {
            writeText: vi.fn(),
        },
    });
});

describe('useClipboard', () => {
    it('should copy text to clipboard successfully', async () => {
        const mockWriteText = vi.fn().mockResolvedValue(undefined);
        Object.assign(navigator.clipboard, { writeText: mockWriteText });

        const { result } = renderHook(() => useClipboard());

        await act(async () => {
            result.current.copyToClipboard('test text', 'Test');
        });

        expect(mockWriteText).toHaveBeenCalledWith('test text');
    });

    it('should use default label if not provided', async () => {
        const mockWriteText = vi.fn().mockResolvedValue(undefined);
        Object.assign(navigator.clipboard, { writeText: mockWriteText });

        const { result } = renderHook(() => useClipboard());

        await act(async () => {
            result.current.copyToClipboard('test text');
        });

        expect(mockWriteText).toHaveBeenCalledWith('test text');
    });

    it('should handle clipboard write failure', async () => {
        const mockWriteText = vi.fn().mockRejectedValue(new Error('Permission denied'));
        Object.assign(navigator.clipboard, { writeText: mockWriteText });

        const { result } = renderHook(() => useClipboard());

        await act(async () => {
            result.current.copyToClipboard('test text', 'Test');
        });

        expect(mockWriteText).toHaveBeenCalled();
        // Error should be logged but not thrown
    });
});
