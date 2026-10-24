/**
 * 人生目标 → 年度现金流映射。
 * 只处理「由资产支付」的目标（currentAssets / freedomAssets / unknown）；
 * ready（已备好）与 futureIncome（工资支付）不进入资产模拟。
 * 所有金额为今日币值。
 */
import type { LifeGoal } from './types';

export interface AnnualGoalCost {
  /** 当年一次性支出（今日币值） */
  oneTime: number;
  /** 当年经常性支出（今日币值，年化） */
  yearlyAmount: number;
}

/** 判断该目标是否需要从可投资资产中出钱 */
export function goalDrawsFromAssets(goal: LifeGoal): boolean {
  return (
    goal.fundingSource === 'currentAssets' ||
    goal.fundingSource === 'freedomAssets' ||
    goal.fundingSource === 'unknown'
  );
}

/**
 * 构建 { age -> { oneTime, yearlyAmount } } 映射。
 * - oneTime：type=oneTime 的今日成本
 * - yearlyAmount：type=yearly 的年额；type=monthly 的月额×12；type=years 的年额并按 yearsCount 摊到后续年份
 */
export function buildGoalSchedule(goals: LifeGoal[]): Map<number, AnnualGoalCost> {
  const map = new Map<number, AnnualGoalCost>();
  const bump = (age: number, apply: (e: AnnualGoalCost) => void) => {
    const entry = map.get(age) ?? { oneTime: 0, yearlyAmount: 0 };
    apply(entry);
    map.set(age, entry);
  };

  for (const goal of goals) {
    if (!goalDrawsFromAssets(goal)) continue;
    if (!Number.isFinite(goal.todayCost) || goal.todayCost < 0) continue;

    if (goal.type === 'oneTime') {
      bump(goal.targetAge, (e) => {
        e.oneTime += goal.todayCost;
      });
    } else if (goal.type === 'yearly') {
      bump(goal.targetAge, (e) => {
        e.yearlyAmount += goal.todayCost;
      });
    } else if (goal.type === 'monthly') {
      bump(goal.targetAge, (e) => {
        e.yearlyAmount += goal.todayCost * 12;
      });
    } else if (goal.type === 'years') {
      const count = Math.max(1, Math.floor(goal.yearsCount ?? 1));
      for (let k = 0; k < count; k++) {
        bump(goal.targetAge + k, (e) => {
          e.yearlyAmount += goal.todayCost;
        });
      }
    }
    // type=unknown：无确定金额结构，跳过
  }
  return map;
}

/** 目标总价（今日币值，用于价格表展示） */
export function goalTotalCost(goal: LifeGoal): number {
  switch (goal.type) {
    case 'oneTime':
    case 'unknown':
      return goal.todayCost;
    case 'yearly':
      return goal.todayCost;
    case 'monthly':
      return goal.todayCost * 12;
    case 'years':
      return goal.todayCost * Math.max(1, Math.floor(goal.yearsCount ?? 1));
    default:
      return goal.todayCost;
  }
}
