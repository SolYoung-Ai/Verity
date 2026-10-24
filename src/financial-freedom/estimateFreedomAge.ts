/**
 * estimateFinancialFreedomAge：从当前资产开始逐年积累，
 * 在每个候选年龄 a 检验「从 a 到规划终点能否不靠工资一直活下去」，
 * 返回最早满足的年龄；找不到返回 null / met=false。
 */
import type { FFPlan, LifeStyle, Scenario } from './types';
import { realReturn } from './calculations';
import { buildGoalSchedule } from './goals';
import {
  annualContributionAtAge,
  lifestyleBudgetMonthly,
  sumIncomeAtAge,
  type YearRow,
} from './projection';

export interface FreedomAgeResult {
  /** 最早实现财务自由的年龄；找不到为 null */
  age: number | null;
  /** 逐年积累路径 */
  yearlyPath: YearRow[];
  /** 是否找到满足年龄 */
  met: boolean;
}

/** 从某年龄开始自由生活是否可持续（全程不透支） */
function freedomSustainable(
  plan: FFPlan,
  scenario: Scenario,
  lifeStyle: LifeStyle,
  startAge: number,
  startAssets: number,
): boolean {
  const r = realReturn(scenario.nominalReturn, scenario.inflation);
  const annualBudget = lifestyleBudgetMonthly(plan, lifeStyle) * 12;
  const schedule = buildGoalSchedule(plan.lifeGoals);

  let B = startAssets;
  for (let age = startAge; age <= plan.planningEndAge; age++) {
    const oneTime = schedule.get(age)?.oneTime ?? 0;
    const recurring = schedule.get(age)?.yearlyAmount ?? 0;
    const I =
      sumIncomeAtAge(plan.futureIncomeSources, age) +
      sumIncomeAtAge(plan.additionalIncomeSources, age);
    const W = Math.max(0, annualBudget + recurring + oneTime - I);
    B = B * (1 + r) - W;
    if (!Number.isFinite(B) || B < 0) return false;
  }
  return true;
}

export function estimateFinancialFreedomAge(
  plan: FFPlan,
  scenario: Scenario,
  lifeStyle: LifeStyle,
): FreedomAgeResult {
  const r = realReturn(scenario.nominalReturn, scenario.inflation);
  const schedule = buildGoalSchedule(plan.lifeGoals);
  const yearlyPath: YearRow[] = [];

  let A = plan.financialAssets.investable;
  let metAge: number | null = null;

  for (let age = plan.currentAge; age <= plan.planningEndAge; age++) {
    // 1) 先检验：以当前资产从 age 开始自由是否可持续
    if (freedomSustainable(plan, scenario, lifeStyle, age, A)) {
      metAge = age;
      break;
    }
    // 2) 不可自由：继续积累一年
    if (age < plan.planningEndAge) {
      const C = annualContributionAtAge(plan, scenario, age);
      const oneTime = schedule.get(age)?.oneTime ?? 0;
      yearlyPath.push({
        age,
        startAssets: A,
        contribution: C,
        goalsPaid: oneTime,
        spending: 0,
        income: 0,
        withdrawal: 0,
        endAssets: A * (1 + r) + C - oneTime,
        realReturn: r,
      });
      A = A * (1 + r) + C - oneTime;
    }
  }

  return { age: metAge, yearlyPath, met: metAge !== null };
}
