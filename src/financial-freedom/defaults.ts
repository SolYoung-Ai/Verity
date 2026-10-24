/**
 * 默认值：三套情景、默认应急金、默认币种、示例 demo 计划。
 */
import type { Currency, FFPlan, Scenario } from './types';

/** 保守：4% 名义 / 3% 通胀 / 2.5% 初始提款率 */
export const CONSERVATIVE_SCENARIO: Scenario = {
  id: 'conservative',
  name: 'conservative',
  nominalReturn: 0.04,
  inflation: 0.03,
  initialWR: 0.025,
  feeTaxNote: '已扣除费用与税后的保守估计',
};

/** 基准：6% 名义 / 2.5% 通胀 / 3.0% 初始提款率 */
export const BASELINE_SCENARIO: Scenario = {
  id: 'baseline',
  name: 'baseline',
  nominalReturn: 0.06,
  inflation: 0.025,
  initialWR: 0.03,
  feeTaxNote: '已扣除费用与税后的中性估计',
};

/** 乐观：8% 名义 / 2.5% 通胀 / 3.5% 初始提款率 */
export const OPTIMISTIC_SCENARIO: Scenario = {
  id: 'optimistic',
  name: 'optimistic',
  nominalReturn: 0.08,
  inflation: 0.025,
  initialWR: 0.035,
  feeTaxNote: '权益占比更高的乐观假设',
};

export const DEFAULT_SCENARIOS: Scenario[] = [
  CONSERVATIVE_SCENARIO,
  BASELINE_SCENARIO,
  OPTIMISTIC_SCENARIO,
];

export const DEFAULT_EMERGENCY_MONTHS = 6;
export const DEFAULT_CURRENCY: Currency = 'CNY';

/** 数值搜索初始可投资资产时的上界（元） */
export const REQUIRED_CAPITAL_SEARCH_MAX = 1e9;

/** 示例 demo 计划（所有金额均为今日币值） */
export function createDemoPlan(): FFPlan {
  return {
    currentAge: 32,
    targetAge: 45,
    planningEndAge: 90,
    householdType: 'single',
    monthlyNetIncome: 25000,
    additionalIncomeSources: [],
    monthlyCurrentSpending: 14000,
    expenseCategories: [
      { key: 'housing', label: '住房', monthlyAmount: 5000, includedInTotal: true },
      { key: 'food', label: '餐饮', monthlyAmount: 4000, includedInTotal: true },
      { key: 'transport', label: '交通', monthlyAmount: 1500, includedInTotal: true },
      { key: 'other', label: '其他', monthlyAmount: 3500, includedInTotal: true },
    ],
    financialAssets: {
      cash: 50000,
      investable: 300000,
      retirement: 0,
      restricted: 0,
      emergencyFund: 150000,
      primaryHomeValue: 0,
      other: 0,
    },
    debts: [],
    monthlyLongTermContribution: 8000,
    annualInvestmentContribution: 60000,
    basicMonthlyBudget: 8000,
    comfortableMonthlyBudget: 15000,
    idealMonthlyBudget: 25000,
    lifeGoals: [
      {
        id: 'g1',
        title: '环球旅行一次',
        todayCost: 120000,
        targetAge: 45,
        type: 'oneTime',
        fundingSource: 'freedomAssets',
        importance: 'want',
      },
    ],
    futureIncomeSources: [
      {
        id: 'fi1',
        name: '养老金',
        amountPerYear: 60000,
        startAge: 60,
        endAge: 90,
        netOfTax: true,
        stability: 'high',
        alreadyIncluded: false,
      },
    ],
    contributionGrowth: 'inflation',
    emergencyMonths: DEFAULT_EMERGENCY_MONTHS,
    initialWR: BASELINE_SCENARIO.initialWR,
    currency: DEFAULT_CURRENCY,
    lifePriorities: ['freedom', 'health'],
    preferredWorkStyle: 'reduce-hours',
    freedomDefinition: 'time-freedom',
    topLifePriorities: ['freedom'],
    demoMode: true,
  };
}
