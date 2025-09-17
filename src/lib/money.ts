import { useI18n } from "./i18n";

export type CurrencyCode = "KRW" | "USD" | "JPY" | "CNY";

const LANG_TO: Record<ReturnType<typeof useI18n>["lang"], { locale: string; currency: CurrencyCode }> = {
  ko: { locale: "ko-KR", currency: "KRW" },
  en: { locale: "en-US", currency: "USD" },
  ja: { locale: "ja-JP", currency: "JPY" },
  zh: { locale: "zh-CN", currency: "CNY" },
};

const DEFAULT_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  KRW: 1350,
  JPY: 150,
  CNY: 7.2,
};

const ROUND_RULE: Record<CurrencyCode, { min: number; max: number }> = {
  KRW: { min: 0, max: 0 },
  JPY: { min: 0, max: 0 },
  USD: { min: 2, max: 2 },
  CNY: { min: 2, max: 2 },
};

export function convertFromUSD(
  usd: number,
  target: CurrencyCode,
  rates: Record<CurrencyCode, number> = DEFAULT_RATES
): number {
  const rate = rates[target] ?? 1;
  return usd * rate;
}

export function formatFromUSD(
  usd: number,
  lang: keyof typeof LANG_TO,
  rates: Record<CurrencyCode, number> = DEFAULT_RATES
): string {
  const { locale, currency } = LANG_TO[lang];
  const rule = ROUND_RULE[currency];
  const rate = rates[currency] ?? 1;
  const amount = usd * rate;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: rule.min,
    maximumFractionDigits: rule.max,
  }).format(amount);
}

export function numberFromUSD(
  usd: number,
  lang: keyof typeof LANG_TO,
  rates: Record<CurrencyCode, number> = DEFAULT_RATES
): number {
  const { currency } = LANG_TO[lang];
  const rate = rates[currency] ?? 1;
  const rule = ROUND_RULE[currency];
  const amount = usd * rate;

  const factor = Math.pow(10, rule.max);
  return Math.round(amount * factor) / factor;
}
