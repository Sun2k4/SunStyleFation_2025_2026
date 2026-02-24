import { describe, it, expect } from 'vitest';
import { PLACEHOLDER_IMAGE, handleImageError } from '../utils/placeholderImage';

describe('placeholderImage', () => {
    // ─── Test 9: PLACEHOLDER_IMAGE is a valid data URI ───
    it('should export a valid SVG data URI', () => {
        expect(PLACEHOLDER_IMAGE).toBeDefined();
        expect(PLACEHOLDER_IMAGE).toMatch(/^data:image\/svg\+xml,/);
        expect(PLACEHOLDER_IMAGE).toContain('SunStyle');
    });

    // ─── Test 10: handleImageError swaps src and prevents infinite loop ───
    it('should set image src to placeholder and remove onerror handler', () => {
        // Create mock image element
        const mockImg = {
            src: 'https://broken-url.com/image.jpg',
            onerror: () => { },
            currentTarget: null as any,
        };
        mockImg.currentTarget = mockImg;

        // Create synthetic event
        const mockEvent = {
            currentTarget: mockImg as unknown as HTMLImageElement,
        } as React.SyntheticEvent<HTMLImageElement>;

        handleImageError(mockEvent);

        // Verify src was changed to placeholder
        expect(mockImg.src).toBe(PLACEHOLDER_IMAGE);
        // Verify onerror was nullified to prevent infinite loop
        expect(mockImg.onerror).toBeNull();
    });
});
