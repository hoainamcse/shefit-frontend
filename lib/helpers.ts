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
  const {
    direction = 'asc',
    transform,
    nullsPosition = 'last'
  } = options || {};

  return arr.sort((a, b) => {
    // Handle undefined/null values
    const aIsNil = a[key] === undefined || a[key] === null;
    const bIsNil = b[key] === undefined || b[key] === null;

    if (aIsNil && bIsNil) return 0;
    if (aIsNil) return nullsPosition === 'first' ? -1 : 1;
    if (bIsNil) return nullsPosition === 'first' ? 1 : -1;

    // Apply transformation if provided
    const aVal = transform ? transform(a[key]) : a[key];
    const bVal = transform ? transform(b[key]) : b[key];

    // Compare values
    const compareResult = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;

    // Apply sort direction
    return direction === 'asc' ? compareResult : -compareResult;
  });
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

export const calculateMonthsFromDates = (
  startDate: Date | string | null | undefined,
  endDate: Date | string | null | undefined
): number => {
  // Return 0 if either date is missing
  if (!startDate || !endDate) return 0

  // Convert to Date objects if they're strings
  const start = startDate instanceof Date ? startDate : new Date(startDate)
  const end = endDate instanceof Date ? endDate : new Date(endDate)

  // Calculate days between dates
  const daysDifference = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  // Convert days to months (35 days = 1 month)
  return Math.round(daysDifference / 35)
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

type Valuable<T> = { [K in keyof T as T[K] extends null | undefined ? never : K]: T[K] }

export function getValuable<T extends {}, V = Valuable<T>>(obj: T): V {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => !((typeof v === 'string' && !v.length) || v === null || typeof v === 'undefined')
    )
  ) as V
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
