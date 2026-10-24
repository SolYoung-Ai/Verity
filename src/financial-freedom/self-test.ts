/**
 * 数学校验（任务书第十五部分 E）。
 * 导出 runSelfCheck()，返回 passed / failed / failures。
 */
import type { FFPlan, LifeStyle } from './types';
import { BASELINE_SCENARIO } from './defaults';
import { realReturn, referenceCapital } from './calculations';
import { simulateLifecycle } from './projection';
import { findRequiredCapital } from './findRequiredCapital';
import { estimateFinancialFreedomAge } from './estimateFreedomAge';
import { buildGoalSchedule } from './goals';

interface TestCase {
  name: string;
  run: () => { passed: boolean; reason?: string };
}

function basePlan(overrides: Partial<FFPlan> = {}): FFPlan {
  const plan: FFPlan = {
    currentAge: 40,
    targetAge: 45,
    planningEndAge: 90,
    householdType: 'single',
    monthlyNetIncome: 20000,
    additionalIncomeSources: [],
    monthlyCurrentSpending: 10000,
    expenseCategories: [],
    financialAssets: {
      cash: 0,
      investable: 1_000_000,
      retirement: 0,
      restricted: 0,
      emergencyFund: 0,
      primaryHomeValue: 0,
      other: 0,
    },
    debts: [],
    monthlyLongTermContribution: 5000,
    annualInvestmentContribution: 0,
    basicMonthlyBudget: 6000,
    comfortableMonthlyBudget: 10000,
    idealMonthlyBudget: 20000,
    lifeGoals: [],
    futureIncomeSources: [],
    contributionGrowth: 'inflation',
    emergencyMonths: 6,
    initialWR: 0.03,
    currency: 'CNY',
    lifePriorities: [],
    preferredWorkStyle: 'unknown',
    freedomDefinition: 'unknown',
    topLifePriorities: [],
  };
  return { ...plan, ...overrides };
}

function allFiniteRows(rows: Array<Record<string, unknown>>): boolean {
  for (const row of rows) {
    for (const v of Object.values(row)) {
      if (typeof v === 'number' && !Number.isFinite(v)) return false;
    }
  }
  return true;
}

const EPS = 1e-6;

const TESTS: TestCase[] = [
  {
    name: '零资产零投入、支出>0 => 未实现自由',
    run: () => {
      const plan = basePlan({
        targetAge: 40, // 立刻进入自由期
        monthlyLongTermContribution: 0,
        annualInvestmentContribution: 0,
        financialAssets: {
          ...basePlan().financialAssets,
          investable: 0,
        },
      });
      const sim = simulateLifecycle(plan, BASELINE_SCENARIO, 'comfortable');
      const est = estimateFinancialFreedomAge(plan, BASELINE_SCENARIO, 'comfortable');
      if (!sim.depleted) return { passed: false, reason: '零资产模拟未判为透支' };
      if (est.met) return { passed: false, reason: '零资产被误判为已实现自由' };
      return { passed: true };
    },
  },
  {
    name: '增加生活开销 => 基础资金参考需求不降',
    run: () => {
      const small = referenceCapital(6000 * 12, 0.03);
      const large = referenceCapital(10000 * 12, 0.03);
      if (large < small - EPS) return { passed: false, reason: `开销变大参考需求反而下降: ${small} -> ${large}` };
      // 真实模拟口径同样成立
      const reqBasic = findRequiredCapital(basePlan(), BASELINE_SCENARIO, 'basic');
      const reqComfort = findRequiredCapital(basePlan(), BASELINE_SCENARIO, 'comfortable');
      if (reqComfort.capital < reqBasic.capital - EPS) {
        return { passed: false, reason: `舒适方案所需资本 < 基础方案: ${reqBasic.capital} -> ${reqComfort.capital}` };
      }
      return { passed: true };
    },
  },
  {
    name: '提高长期投入 => 资产积累不变差',
    run: () => {
      const low = simulateLifecycle(basePlan({ monthlyLongTermContribution: 0 }), BASELINE_SCENARIO, 'comfortable');
      const high = simulateLifecycle(basePlan({ monthlyLongTermContribution: 10000 }), BASELINE_SCENARIO, 'comfortable');
      const endLow = low.yearly[low.yearly.length - 1].endAssets;
      const endHigh = high.yearly[high.yearly.length - 1].endAssets;
      if (endHigh < endLow - EPS) return { passed: false, reason: `多投入导致期末资产下降: ${endLow} -> ${endHigh}` };
      return { passed: true };
    },
  },
  {
    name: '降低提款率 => 基础资本需求增加或不变',
    run: () => {
      const higherWR = referenceCapital(120_000, 0.03);
      const lowerWR = referenceCapital(120_000, 0.025);
      if (lowerWR < higherWR - EPS) {
        return { passed: false, reason: `提款率降低参考需求下降: ${higherWR} -> ${lowerWR}` };
      }
      return { passed: true };
    },
  },
  {
    name: '一次性目标增加 => 对应阶段重算且需求上升',
    run: () => {
      const withGoal = basePlan({
        lifeGoals: [
          {
            id: 'g',
            title: '大目标',
            todayCost: 500_000,
            targetAge: 45,
            type: 'oneTime',
            fundingSource: 'freedomAssets',
            importance: 'must',
          },
        ],
      });
      const reqNo = findRequiredCapital(basePlan(), BASELINE_SCENARIO, 'comfortable');
      const reqYes = findRequiredCapital(withGoal, BASELINE_SCENARIO, 'comfortable');
      if (reqYes.capital < reqNo.capital + 1000) {
        return { passed: false, reason: `一次性目标增加后所需资本未上升: ${reqNo.capital} -> ${reqYes.capital}` };
      }
      // 目标确实出现在模拟行里
      const sim = simulateLifecycle(withGoal, BASELINE_SCENARIO, 'comfortable');
      const row45 = sim.yearly.find((r) => r.age === 45);
      if (!row45 || Math.abs(row45.goalsPaid - 500_000) > EPS) {
        return { passed: false, reason: '45 岁年度目标支出未计入 goalsPaid' };
      }
      return { passed: true };
    },
  },
  {
    name: '未来收入只在有效年龄区间计入',
    run: () => {
      const active = basePlan({
        futureIncomeSources: [
          { id: 'fi', name: '租金', amountPerYear: 60_000, startAge: 50, endAge: 90, netOfTax: true, stability: 'high', alreadyIncluded: false },
        ],
      });
      const endedEarly = basePlan({
        futureIncomeSources: [
          { id: 'fi', name: '租金', amountPerYear: 60_000, startAge: 50, endAge: 44, netOfTax: true, stability: 'high', alreadyIncluded: false },
        ],
      });
      const outOfRange = basePlan({
        futureIncomeSources: [
          { id: 'fi', name: '租金', amountPerYear: 60_000, startAge: 95, endAge: 100, netOfTax: true, stability: 'high', alreadyIncluded: false },
        ],
      });
      const simActive = simulateLifecycle(active, BASELINE_SCENARIO, 'comfortable');
      const simEarly = simulateLifecycle(endedEarly, BASELINE_SCENARIO, 'comfortable');
      const simFar = simulateLifecycle(outOfRange, BASELINE_SCENARIO, 'comfortable');
      const endActive = simActive.yearly[simActive.yearly.length - 1].endAssets;
      const endEarly = simEarly.yearly[simEarly.yearly.length - 1].endAssets;
      const endFar = simFar.yearly[simFar.yearly.length - 1].endAssets;
      if (endActive <= endEarly + EPS) {
        return { passed: false, reason: `有效期内收入未提升期末资产: active=${endActive} early=${endEarly}` };
      }
      if (Math.abs(endFar - endEarly) > EPS) {
        return { passed: false, reason: `区间外收入被误计入: far=${endFar} vs early=${endEarly}` };
      }
      // 区间内某一年的 income 列必须等于该来源年额
      const row50 = simActive.yearly.find((r) => r.age === 50);
      if (!row50 || row50.income < 60_000 - EPS) {
        return { passed: false, reason: '50 岁自由期收入列缺失' };
      }
      return { passed: true };
    },
  },
  {
    name: '生活预算中的费用不重复计入目标',
    run: () => {
      // 未来收入支付的「房租」月目标不应进入资产目标调度表
      const goals = [
        {
          id: 'g',
          title: '房租',
          todayCost: 5000,
          targetAge: 45,
          type: 'monthly' as const,
          fundingSource: 'futureIncome' as const,
          importance: 'must' as const,
        },
      ];
      const schedule = buildGoalSchedule(goals);
      if (schedule.size !== 0) return { passed: false, reason: 'futureIncome 目标被错误计入资产调度表' };
      // 自由期 spending 列必须严格等于生活预算年化，不含预算重复项
      const plan = basePlan({ lifeGoals: goals });
      const sim = simulateLifecycle(plan, BASELINE_SCENARIO, 'comfortable');
      for (const row of sim.yearly) {
        if (row.age >= plan.targetAge && Math.abs(row.spending - plan.comfortableMonthlyBudget * 12) > EPS) {
          return { passed: false, reason: `年龄 ${row.age} 的自由期支出含预算外重复项: ${row.spending}` };
        }
      }
      return { passed: true };
    },
  },
  {
    name: '自住房默认不加入可投资资产',
    run: () => {
      const noHouse = simulateLifecycle(basePlan(), BASELINE_SCENARIO, 'comfortable');
      const withHouse = simulateLifecycle(
        basePlan({ financialAssets: { ...basePlan().financialAssets, primaryHomeValue: 2_000_000 } }),
        BASELINE_SCENARIO,
        'comfortable',
      );
      const a = noHouse.yearly[noHouse.yearly.length - 1].endAssets;
      const b = withHouse.yearly[withHouse.yearly.length - 1].endAssets;
      if (Math.abs(a - b) > EPS) return { passed: false, reason: `自住房市值被计入模拟: ${a} vs ${b}` };
      return { passed: true };
    },
  },
  {
    name: '负收益率 / 零收益率可计算且无异常',
    run: () => {
      const rNeg = realReturn(-0.02, 0.03);
      if (!Number.isFinite(rNeg)) return { passed: false, reason: '负名义收益率实际值非有限' };
      const badScenario = { ...BASELINE_SCENARIO, id: 'bad', nominalReturn: -0.02 };
      const sim = simulateLifecycle(basePlan(), badScenario, 'comfortable');
      if (!allFiniteRows(sim.yearly as unknown as Array<Record<string, unknown>>)) {
        return { passed: false, reason: '负收益率模拟出现 NaN/Infinity' };
      }
      const zeroReal = simulateLifecycle(
        basePlan(),
        { ...BASELINE_SCENARIO, id: 'zero', nominalReturn: 0.025 },
        'comfortable',
      );
      if (!allFiniteRows(zeroReal.yearly as unknown as Array<Record<string, unknown>>)) {
        return { passed: false, reason: '零实际收益率模拟出现 NaN/Infinity' };
      }
      // wr=0 时参考资本按约定返回 Infinity，不抛异常
      const inf = referenceCapital(120_000, 0);
      if (Number.isFinite(inf)) return { passed: false, reason: 'wr=0 未返回 Infinity' };
      return { passed: true };
    },
  },
  {
    name: '全部计算结果无 NaN / Infinity',
    run: () => {
      const styles: LifeStyle[] = ['basic', 'comfortable', 'ideal'];
      for (const style of styles) {
        const sim = simulateLifecycle(basePlan(), BASELINE_SCENARIO, style);
        if (!allFiniteRows(sim.yearly as unknown as Array<Record<string, unknown>>)) {
          return { passed: false, reason: `${style} 模拟行含非有限数` };
        }
        const req = findRequiredCapital(basePlan(), BASELINE_SCENARIO, style);
        if (!Number.isFinite(req.capital) && req.feasible) {
          return { passed: false, reason: `${style} 可行但所需资本非有限` };
        }
        const est = estimateFinancialFreedomAge(basePlan(), BASELINE_SCENARIO, style);
        if (!allFiniteRows(est.yearlyPath as unknown as Array<Record<string, unknown>>)) {
          return { passed: false, reason: `${style} 自由年龄路径含非有限数` };
        }
      }
      return { passed: true };
    },
  },
];

export interface SelfCheckResult {
  passed: number;
  failed: number;
  failures: string[];
}

export function runSelfCheck(): SelfCheckResult {
  let passed = 0;
  const failures: string[] = [];
  for (const test of TESTS) {
    try {
      const result = test.run();
      if (result.passed) {
        passed += 1;
      } else {
        failures.push(`${test.name} — ${result.reason ?? '未知原因'}`);
      }
    } catch (err) {
      failures.push(`${test.name} — 异常: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return { passed, failed: failures.length, failures };
}
