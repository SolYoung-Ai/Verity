/**
 * findRequiredCapital：数值搜索能覆盖整个规划期的初始可投资资产。
 *
 * 单调性保证：A_{t+1} 对 A_t 是线性的（因子 1+r > 0），
 * 因此「初始资本越大，全程资产越高」单调非减，可用二分搜索。
 * 判定标准：全程每一年末资产 >= 0（不出现透支）。
 * 搜索范围 [0, 1e9]；上界仍透支则返回 feasible=false。
 */
import type { FFPlan, LifeStyle, Scenario } from './types';
import { simulateLifecycle } from './projection';
import { REQUIRED_CAPITAL_SEARCH_MAX } from './defaults';

export interface RequiredCapitalResult {
  /** 最小可投资初始资本（今日币值） */
  capital: number;
  /** 在搜索范围内能否实现全程不透支 */
  feasible: boolean;
  searchRange: [number, number];
}

function feasibleAt(plan: FFPlan, scenario: Scenario, lifeStyle: LifeStyle, K: number): boolean {
  const res = simulateLifecycle(plan, scenario, lifeStyle, { overrideStartAssets: K });
  return Number.isFinite(res.minEndAssets) && res.minEndAssets >= 0;
}

export function findRequiredCapital(
  plan: FFPlan,
  scenario: Scenario,
  lifeStyle: LifeStyle,
): RequiredCapitalResult {
  const MAX = REQUIRED_CAPITAL_SEARCH_MAX;
  const range: [number, number] = [0, MAX];

  if (feasibleAt(plan, scenario, lifeStyle, MAX)) {
    // 已有资本即可达标
    if (feasibleAt(plan, scenario, lifeStyle, 0)) {
      return { capital: 0, feasible: true, searchRange: range };
    }
    let lo = 0;
    let hi = MAX;
    for (let i = 0; i < 80; i++) {
      const mid = (lo + hi) / 2;
      if (feasibleAt(plan, scenario, lifeStyle, mid)) {
        hi = mid;
      } else {
        lo = mid;
      }
    }
    return { capital: hi, feasible: true, searchRange: range };
  }

  return { capital: MAX, feasible: false, searchRange: range };
}
