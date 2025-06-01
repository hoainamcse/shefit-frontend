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
  if (!startDate || !endDate) return 0;
  
  // Convert to Date objects if they're strings
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);
  
  // Calculate days between dates
  const daysDifference = Math.round(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Convert days to months (35 days = 1 month)
  return Math.round(daysDifference / 35);
};

