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

export const normalizeEmail = (email: string): string => {
  const [local, domain] = email.toLowerCase().split('@');
  if (!local || !domain) return email;

  // Remove +alias and dots (Gmail-style)
  const cleanLocal = local.split('+')[0].replace(/\./g, '');
  return `${cleanLocal}@${domain}`;
};

export function getSafeIp(req: any): string {
  // In production, trust only your reverse proxy
  if (process.env.NODE_ENV === 'production') {
    // Assumes you set 'trust proxy' in Express or use a trusted header
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
  // In dev, use X-Forwarded-For for local testing
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.ip ||
    req.socket.remoteAddress ||
    'unknown'
  );
}
