/**
 * 生命周期现金流模拟（全部以今日币值记账）。
 *
 * 积累阶段（age < targetAge）：
 *   A_{t+1} = A_t * (1 + r_real) + C_t - H_t
 *   C_t = 长期投入（按 contributionGrowth 折算）+ 未标记 alreadyIncluded 的额外收入 - 债务年供
 *   H_t = 当年由当前可投资资产支付的一次性目标
 *
 * 自由阶段（age >= targetAge）：
 *   A_{t+1} = A_t * (1 + r_real) - W_t
 *   W_t = max(0, E_t + L_t + H_t - I_t)
 *   E_t = 生活方案年预算；L_t = 经常性目标年额；I_t = 自由期收入（只在 [startAge, endAge] 内）
 *
 * 默认口径：
 * - 可投资资产起点 = financialAssets.investable（自住房/应急金/退休账户均不计入）
 * - 已标记 alreadyIncluded 的收入不重复加
 */
import type {
  AdditionalIncomeSource,
  FFPlan,
  FutureIncomeSource,
  LifeStyle,
  Scenario,
} from './types';
import { realReturn } from './calculations';
import { buildGoalSchedule } from './goals';

export interface YearRow {
  age: number;
  startAssets: number;
  /** 当年净投入（积累期） */
  contribution: number;
  /** 当年由资产支付的一次性目标（今日币值） */
  goalsPaid: number;
  /** 当年生活支出（自由期=预算年化） */
  spending: number;
  /** 当年计入的其他收入 */
  income: number;
  /** 当年净提款 W_t（自由期） */
  withdrawal: number;
  endAssets: number;
  realReturn: number;
}

export interface SimResult {
  yearly: YearRow[];
  endingAge: number;
  minEndAssets: number;
  depleted: boolean;
}

export function lifestyleBudgetMonthly(plan: FFPlan, lifeStyle: LifeStyle): number {
  if (lifeStyle === 'basic') return plan.basicMonthlyBudget;
  if (lifeStyle === 'ideal') return plan.idealMonthlyBudget;
  return plan.comfortableMonthlyBudget;
}

/** 汇总某一年龄下「有效」收入（未标记 alreadyIncluded 且落在年龄窗内） */
export function sumIncomeAtAge(
  sources: Array<AdditionalIncomeSource | FutureIncomeSource>,
  age: number,
): number {
  let total = 0;
  for (const s of sources) {
    if (s.alreadyIncluded) continue;
    if (age < s.startAge || age > s.endAge) continue;
    if (Number.isFinite(s.amountPerYear)) total += s.amountPerYear;
  }
  return total;
}

/** 积累期净投入（今日币值）：基础投入按增长率折算 + 额外收入 - 债务年供 */
export function annualContributionAtAge(plan: FFPlan, scenario: Scenario, age: number): number {
  const yearsFromNow = Math.max(0, age - plan.currentAge);
  const base = plan.annualInvestmentContribution + plan.monthlyLongTermContribution * 12;

  // 真实增长：按通胀增长 → 真实增长率 0；自定义 → 扣除通胀；固定 → 0
  let realGrowth = 0;
  if (plan.contributionGrowth === 'custom' && Number.isFinite(plan.customContributionGrowth)) {
    realGrowth = plan.customContributionGrowth - scenario.inflation;
  }
  const growthFactor = Math.pow(1 + realGrowth, yearsFromNow);

  const extraIncome = sumIncomeAtAge(plan.additionalIncomeSources, age);
  const debtAnnual = plan.debts.reduce((sum, d) => sum + Math.max(0, d.monthlyPayment) * 12, 0);

  return base * growthFactor + extraIncome - debtAnnual;
}

export interface SimulateOptions {
  /** 覆盖可投资资产起点（findRequiredCapital 数值搜索用） */
  overrideStartAssets?: number;
}

export function simulateLifecycle(
  plan: FFPlan,
  scenario: Scenario,
  lifeStyle: LifeStyle,
  options: SimulateOptions = {},
): SimResult {
  const r = realReturn(scenario.nominalReturn, scenario.inflation);
  const annualBudget = lifestyleBudgetMonthly(plan, lifeStyle) * 12;
  const schedule = buildGoalSchedule(plan.lifeGoals);

  let A = Number.isFinite(options.overrideStartAssets as number)
    ? (options.overrideStartAssets as number)
    : plan.financialAssets.investable;

  const yearly: YearRow[] = [];
  let minEnd = Number.POSITIVE_INFINITY;

  for (let age = plan.currentAge; age <= plan.planningEndAge; age++) {
    const row: YearRow = {
      age,
      startAssets: A,
      contribution: 0,
      goalsPaid: 0,
      spending: 0,
      income: 0,
      withdrawal: 0,
      endAssets: A,
      realReturn: r,
    };

    const oneTime = schedule.get(age)?.oneTime ?? 0;
    const recurring = schedule.get(age)?.yearlyAmount ?? 0;

    if (age < plan.targetAge) {
      // ---- 积累期 ----
      const C = annualContributionAtAge(plan, scenario, age);
      row.contribution = C;
      row.goalsPaid = oneTime;
      row.spending = 0;
      row.income = 0;
      A = A * (1 + r) + C - oneTime;
    } else {
      // ---- 自由期 ----
      const I = sumIncomeAtAge(plan.futureIncomeSources, age) +
        sumIncomeAtAge(plan.additionalIncomeSources, age);
      const W = Math.max(0, annualBudget + recurring + oneTime - I);
      row.spending = annualBudget;
      row.income = I;
      row.withdrawal = W;
      row.goalsPaid = oneTime;
      A = A * (1 + r) - W;
    }

    row.endAssets = A;
    if (Number.isFinite(A)) minEnd = Math.min(minEnd, A);
    yearly.push(row);
  }

  return {
    yearly,
    endingAge: plan.planningEndAge,
    minEndAssets: Number.isFinite(minEnd) ? minEnd : NaN,
    depleted: minEnd < 0,
  };
}
