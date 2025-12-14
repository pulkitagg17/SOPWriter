/**
 * Sanitize text input to prevent XSS attacks
 * Removes HTML tags and dangerous characters
 */
export function sanitizeText(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent HTML injection
    .substring(0, 10000); // Max length protection
}

/**
 * Sanitize HTML content - strip all HTML tags
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .trim();
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

/**
 * Escape special regex characters to prevent ReDoS attacks
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
