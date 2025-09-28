/**
 * Sorts an array of objects by a specified key
 * @param arr Array to sort
 * @param key Object key to sort by
 * @param options Additional sorting options
 * @returns Sorted array (modifies original array)
 */
export function sortByKey<T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
  options?: {
    direction?: 'asc' | 'desc'
    transform?: (val: any) => number | string
    nullsPosition?: 'first' | 'last'
  }
): T[] {
  const { direction = 'asc', transform, nullsPosition = 'last' } = options || {}

  return arr.sort((a, b) => {
    // Handle undefined/null values
    const aIsNil = a[key] === undefined || a[key] === null
    const bIsNil = b[key] === undefined || b[key] === null

    if (aIsNil && bIsNil) return 0
    if (aIsNil) return nullsPosition === 'first' ? -1 : 1
    if (bIsNil) return nullsPosition === 'first' ? 1 : -1

    // Apply transformation if provided
    const aVal = transform ? transform(a[key]) : a[key]
    const bVal = transform ? transform(b[key]) : b[key]

    // Compare values
    const compareResult = aVal < bVal ? -1 : aVal > bVal ? 1 : 0

    // Apply sort direction
    return direction === 'asc' ? compareResult : -compareResult
  })
}

export const removeAccents = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const generateUsername = (fullname: string): string => {
  const normalizedName = removeAccents(fullname.trim().toLowerCase())
  const username = normalizedName.replace(/\s+/g, '')
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `${username}@${randomNum}`
}

export const generatePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let pwd = ''
  for (let i = 0; i < 8; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pwd
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: 'accurate' | 'normal'
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? accurateSizes[i] ?? 'Bytes' : sizes[i] ?? 'Bytes'
  }`
}

export function formatCurrency(amount: number, currency: string = 'VND'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatDateString(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`
}

export const formatDuration = (duration: number) => {
  if (duration !== 0 && duration % 35 === 0) {
    return `${duration / 35} tháng`
  }
  return `${duration} ngày`
}

/**
 * Converts HTML string to plain text by removing HTML tags and decoding HTML entities
 * Designed for server-side execution (Node.js)
 */

interface HtmlToTextOptions {
  preserveLineBreaks?: boolean;
  preserveSpaces?: boolean;
  trimWhitespace?: boolean;
}

/**
 * HTML entity mappings for decoding common entities
 */
const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&hellip;': '...',
  '&mdash;': '—',
  '&ndash;': '–',
  '&lsquo;': '\'',
  '&rsquo;': '\'',
  '&ldquo;': '"',
  '&rdquo;': '"',
};

/**
 * Decodes HTML entities in a string
 */
function decodeHtmlEntities(text: string): string {
  // Replace named entities
  let decoded = text.replace(/&[a-zA-Z][a-zA-Z0-9]*;/g, (match) => {
    return HTML_ENTITIES[match] || match;
  });

  // Replace numeric entities (&#123; and &#x1A;)
  decoded = decoded.replace(/&#(\d+);/g, (match, num) => {
    const charCode = parseInt(num, 10);
    return isNaN(charCode) ? match : String.fromCharCode(charCode);
  });

  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    const charCode = parseInt(hex, 16);
    return isNaN(charCode) ? match : String.fromCharCode(charCode);
  });

  return decoded;
}

/**
 * Converts HTML string to plain text
 */
export function htmlToText(
  html: string,
  options: HtmlToTextOptions = {}
): string {
  const {
    preserveLineBreaks = true,
    preserveSpaces = false,
    trimWhitespace = true,
  } = options;

  if (!html || typeof html !== 'string') {
    return '';
  }

  let text = html;

  // Remove script and style elements completely
  text = text.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');

  // Convert common block elements to line breaks
  if (preserveLineBreaks) {
    text = text.replace(/<(div|p|br|h[1-6]|li|tr)[^>]*>/gi, '\n');
    text = text.replace(/<\/(div|p|h[1-6]|li|blockquote|pre)>/gi, '\n');
  }

  // Remove all remaining HTML tags
  text = text.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  text = decodeHtmlEntities(text);

  // Handle whitespace
  if (!preserveSpaces) {
    // Replace multiple spaces with single space
    text = text.replace(/[ \t]+/g, ' ');
  }

  if (preserveLineBreaks) {
    // Clean up multiple line breaks but preserve intentional ones
    text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
  } else {
    // Replace all line breaks with spaces if not preserving them
    text = text.replace(/[\r\n]+/g, ' ');
  }

  if (trimWhitespace) {
    // Trim leading/trailing whitespace from each line
    text = text
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      .trim();
  }

  return text;
}

// Alternative simpler version for basic use cases
export function simpleHtmlToText(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')   // Remove styles
    .replace(/<[^>]*>/g, '')                          // Remove all tags
    .replace(/&nbsp;/g, ' ')                          // Replace &nbsp;
    .replace(/&amp;/g, '&')                           // Replace &amp;
    .replace(/&lt;/g, '<')                            // Replace &lt;
    .replace(/&gt;/g, '>')                            // Replace &gt;
    .replace(/&quot;/g, '"')                          // Replace &quot;
    .replace(/&#39;/g, "'")                           // Replace &#39;
    .replace(/\s+/g, ' ')                             // Normalize whitespace
    .trim();
}

// Usage examples:
/*
const htmlContent = `
  <html>
    <body>
      <h1>Welcome to our site!</h1>
      <p>This is a <strong>sample</strong> HTML content with &quot;quotes&quot; and &amp; symbols.</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
      <script>alert('evil');</script>
    </body>
  </html>
`;

// Basic usage
const plainText1 = htmlToText(htmlContent);
console.log(plainText1);

// With custom options
const plainText2 = htmlToText(htmlContent, {
  preserveLineBreaks: false,
  preserveSpaces: true,
  trimWhitespace: false
});

// Simple version
const plainText3 = simpleHtmlToText(htmlContent);
*/
