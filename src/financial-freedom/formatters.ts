/**
 * 展示层格式化（纯函数，不含任何 UI / DOM 依赖）。
 */
import type { Currency } from './types';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  CNY: '¥',
  MYR: 'RM',
  USD: '$',
  SGD: 'S$',
  HKD: 'HK$',
  TWD: 'NT$',
  EUR: '€',
  GBP: '£',
};

export function currencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency] ?? '';
}

/** 千分位金额，如 ¥1,234,567 */
export function formatCurrency(amount: number, currency: Currency = 'CNY'): string {
  if (!Number.isFinite(amount)) return '—';
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(Math.round(amount));
  const grouped = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}${currencySymbol(currency)}${grouped}`;
}

export function formatAgeRange(from: number, to: number): string {
  return `${from}–${to} 岁`;
}

/** 0.06 -> "6.0%" */
export function formatPercent(ratio: number, digits = 1): string {
  if (!Number.isFinite(ratio)) return '—';
  return `${(ratio * 100).toFixed(digits)}%`;
}

export function formatYears(years: number): string {
  if (!Number.isFinite(years)) return '—';
  if (Math.abs(years - Math.round(years)) < 0.05) return `${Math.round(years)} 年`;
  return `${years.toFixed(1)} 年`;
}
