// src/lib/money.ts
const USD_TO_KRW = 1350;

/** USD → KRW 숫자 (정수원) */
export function usdToKrw(usd: number, rate = USD_TO_KRW): number {
  return Math.round(usd * rate);
}

/** KRW를 '백원 단위 반올림' 처리 (예: 12,990 → 13,000 / 12,365 → 12,400) */
export function roundKrwHundreds(krw: number): number {
  // 100원 단위로 반올림
  return Math.round(krw / 100) * 100;
}

/** USD를 KRW로 변환 + 백원 반올림 후 "12,300원" 형태로 반환 */
export function formatKrwWon(usd: number, rate = USD_TO_KRW): string {
  const krw = usdToKrw(usd, rate);
  const rounded = roundKrwHundreds(krw);
  return `${rounded.toLocaleString("ko-KR")}원`;
}
