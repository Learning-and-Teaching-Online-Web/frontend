/**
 * Formatting utilities for money, currency, and salary display in Vietnamese format.
 * Formats numbers like 1000000 -> 1.000.000 VNĐ
 */

export function formatVND(num: number | string | null | undefined): string {
  if (num === null || num === undefined || num === '') return '0 VNĐ';
  const n = typeof num === 'string' ? Number(num.replace(/[^0-9.-]/g, '')) : num;
  if (isNaN(n)) return '0 VNĐ';
  return new Intl.NumberFormat('vi-VN').format(n) + ' VNĐ';
}

export function formatMoneyString(val?: string | number | null, fallback: string = 'Thỏa thuận'): string {
  if (val === undefined || val === null || val === '') return fallback;

  if (typeof val === 'number') {
    if (isNaN(val)) return fallback;
    return new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ';
  }

  const str = String(val).trim();
  if (!str) return fallback;

  // If it's pure number string e.g. "250000"
  if (/^\d+$/.test(str)) {
    const num = Number(str);
    return new Intl.NumberFormat('vi-VN').format(num) + ' VNĐ';
  }

  // Replace commas with dots e.g. 250,000 -> 250.000
  // and format raw numeric sequences of 4+ digits without dots e.g. 250000 -> 250.000
  return str
    .replace(/(\d+),(\d{3})/g, '$1.$2')
    .replace(/\b(\d{4,12})\b/g, (match) => {
      return new Intl.NumberFormat('vi-VN').format(Number(match));
    });
}

/**
 * Formats a raw number or input string into dot-separated format as user types (e.g. "250000" -> "250.000")
 */
export function formatInputNumber(val: string | number | null | undefined): string {
  if (val === null || val === undefined || val === '') return '';
  const digits = String(val).replace(/\D/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString('vi-VN');
}

/**
 * Parses a dot-formatted input string back to a raw number (e.g. "250.000" -> 250000)
 */
export function parseInputNumber(val: string | null | undefined): number {
  if (!val) return 0;
  const digits = String(val).replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}
