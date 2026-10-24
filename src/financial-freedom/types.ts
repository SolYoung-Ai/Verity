/**
 * 财务自由计算器 —— 领域模型类型定义
 * 所有金额除特别标注外，均以「今天实际购买力」（今日币值）为基准。
 */

export type Currency =
  | 'CNY'
  | 'MYR'
  | 'USD'
  | 'SGD'
  | 'HKD'
  | 'TWD'
  | 'EUR'
  | 'GBP';

/** 人生优先级（多选，最多 3 项） */
export type LifePrioritiesMultiSelect = string[];

export type PreferredWorkStyle =
  | 'continue-working'
  | 'reduce-hours'
  | 'switch-career'
  | 'stop-working'
  | 'own-business'
  | 'unknown';

export type FreedomDefinition =
  | 'passive-income-covers-spending'
  | 'never-work-again'
  | 'optional-work'
  | 'time-freedom'
  | 'unknown';

export type HouseholdType =
  | 'single'
  | 'couple-no-kids'
  | 'couple-with-kids'
  | 'single-parent'
  | 'extended'
  | 'unknown';

/** 积累期额外收入（已包含在工资里的部分用 alreadyIncluded 标记，避免重复计算） */
export interface AdditionalIncomeSource {
  id: string;
  name: string;
  /** 年金额（今日币值），无论 frequency 是 monthly 还是 yearly，均已折算为年额 */
  amountPerYear: number;
  frequency: 'monthly' | 'yearly';
  /** 仅在 [startAge, endAge] 年龄段内计入 */
  startAge: number;
  endAge: number;
  /** 是否已为税后净额 */
  isAfterCostTax: boolean;
  /** 是否已计入月工资 / 已有现金流中（true 则计算时不再重复加） */
  alreadyIncluded: boolean;
}

export interface ExpenseCategory {
  key: string;
  label: string;
  monthlyAmount: number;
  /** 是否计入「当前月支出」总额 */
  includedInTotal: boolean;
}

/** 资产表。primaryHomeValue（自住房）默认不计入可投资资产；emergencyFund 独立显示 */
export interface FinancialAssets {
  /** 活期现金 */
  cash: number;
  /** 可投资资产（模拟起点） */
  investable: number;
  /** 退休账户（暂不计入模拟起点，仅展示） */
  retirement: number;
  /** 受限资产（期权 / 限售股等） */
  restricted: number;
  /** 应急金（独立显示，不当作可提款资产） */
  emergencyFund: number;
  /** 自住房市值（默认不计入可投资资产） */
  primaryHomeValue: number;
  other: number;
}

export interface Debt {
  id: string;
  type: string;
  balance: number;
  monthlyPayment: number;
  apr?: number;
  payoffYears?: number;
  prepayPlan: 'none' | 'from-cash' | 'from-investable' | 'from-income';
  fundingSource: 'income' | 'cash' | 'investable';
}

export type LifeGoalType = 'oneTime' | 'yearly' | 'monthly' | 'years' | 'unknown';

/**
 * fundingSource:
 * - ready         ：已备好的一次性支出，不影响资产模拟
 * - futureIncome  ：由未来工资 / 劳动收入支付，不影响可投资资产
 * - currentAssets ：由当前可投资资产在积累期支付（H_t）
 * - freedomAssets ：由自由期提款支付（W_t 的一部分）
 * - unknown       ：未标注，保守起见按 freedomAssets 处理
 */
export type GoalFundingSource =
  | 'ready'
  | 'futureIncome'
  | 'currentAssets'
  | 'freedomAssets'
  | 'unknown';

export type GoalImportance = 'must' | 'want' | 'nice' | 'unsure';

export interface LifeGoal {
  id: string;
  title: string;
  /** 今日币值成本：oneTime=一次性总额；yearly=每年额；monthly=每月额；years=每年额 */
  todayCost: number;
  /** 目标发生年龄 */
  targetAge: number;
  type: LifeGoalType;
  /** type=years 时持续年数 */
  yearsCount?: number;
  fundingSource: GoalFundingSource;
  importance: GoalImportance;
}

/** 自由期（退休后）收入来源：养老金、租金、副业等 */
export interface FutureIncomeSource {
  id: string;
  name: string;
  amountPerYear: number;
  startAge: number;
  endAge: number;
  netOfTax: boolean;
  stability: 'high' | 'medium' | 'low' | 'unknown';
  alreadyIncluded: boolean;
}

export type ScenarioKind = 'conservative' | 'baseline' | 'optimistic' | 'custom';

export interface Scenario {
  id: string;
  name: ScenarioKind;
  /** 名义年化收益率，如 0.06 */
  nominalReturn: number;
  /** 通胀率，如 0.025 */
  inflation: number;
  /** 初始安全提款率，如 0.03（仅作参考资本交叉检查用） */
  initialWR: number;
  feeTaxNote: string;
}

/** 长期投入的增长方式：按通胀增长 / 自定义增长率 / 固定不变 */
export type ContributionGrowth = 'inflation' | 'custom' | 'fixed';

export type LifeStyle = 'basic' | 'comfortable' | 'ideal';

/** 用户输入汇总大对象 */
export interface FFPlan {
  currentAge: number;
  targetAge: number;
  planningEndAge: number;
  householdType: HouseholdType;
  /** 当前税后月收入 */
  monthlyNetIncome: number;
  additionalIncomeSources: AdditionalIncomeSource[];
  monthlyCurrentSpending: number;
  expenseCategories: ExpenseCategory[];
  financialAssets: FinancialAssets;
  debts: Debt[];
  /** 每月长期投入（定投 / 储蓄） */
  monthlyLongTermContribution: number;
  /** 每年追加投资 */
  annualInvestmentContribution: number;
  basicMonthlyBudget: number;
  comfortableMonthlyBudget: number;
  idealMonthlyBudget: number;
  lifeGoals: LifeGoal[];
  futureIncomeSources: FutureIncomeSource[];
  contributionGrowth: ContributionGrowth;
  /** contributionGrowth=custom 时的名义年增长率 */
  customContributionGrowth?: number;
  emergencyMonths: number;
  /** 全局默认初始提款率（情景内另有值时以情景为准） */
  initialWR: number;
  currency: Currency;
  lifePriorities: LifePrioritiesMultiSelect;
  preferredWorkStyle: PreferredWorkStyle;
  freedomDefinition: FreedomDefinition;
  topLifePriorities: string[];
  demoMode?: boolean;
}
