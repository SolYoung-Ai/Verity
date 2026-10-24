/**
 * 基础换算：实际收益率、参考资本、通胀折现。
 * 全部为纯函数。
 */

/** 实际收益率 r = (1+名义收益率)/(1+通胀) - 1 */
export function realReturn(nominalReturn: number, inflation: number): number {
  if (1 + inflation === 0) return NaN;
  return (1 + nominalReturn) / (1 + inflation) - 1;
}

/**
 * 参考资本 = 年资金缺口 / 初始提款率（交叉检查用，粗算）。
 * wr <= 0 时返回 Infinity，交由上层处理。
 */
export function referenceCapital(annualGap: number, withdrawalRate: number): number {
  if (withdrawalRate <= 0) return Number.POSITIVE_INFINITY;
  if (annualGap <= 0) return 0;
  return annualGap / withdrawalRate;
}

/** 把今日币值金额按通胀折算到 years 年后的名义金额 */
export function inflateValue(todayValue: number, years: number, inflation: number): number {
  if (years <= 0) return todayValue;
  return todayValue * Math.pow(1 + inflation, years);
}

/** 名义金额折现回今日币值 */
export function deflateValue(nominalValue: number, years: number, inflation: number): number {
  if (years <= 0) return nominalValue;
  return nominalValue / Math.pow(1 + inflation, years);
}

export function isFiniteNumber(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x);
}
