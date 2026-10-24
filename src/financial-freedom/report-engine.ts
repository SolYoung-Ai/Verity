/**
 * buildReport：把 plan + 计算结果组装成 9 章报告所需的结构化数据。
 * 文案 key 由 plan 字段（优先级 / 工作风格 / 自由定义 / 缺口大小）推导，不写死通用文案。
 */
import type { FFPlan, LifeStyle, Scenario } from './types';
import { BASELINE_SCENARIO } from './defaults';
import { compareScenarios, type ScenarioComparison } from './scenarios';
import { findRequiredCapital } from './findRequiredCapital';
import { goalDrawsFromAssets, goalTotalCost } from './goals';

export interface ReportBudget {
  monthly: number;
  annual: number;
}

export interface ReportGoalRow {
  id: string;
  title: string;
  targetAge: number;
  type: string;
  todayCost: number;
  totalCost: number;
  fundingSource: string;
  importance: string;
  drawsFromAssets: boolean;
}

export interface SensitivityPoint {
  minus1Pct: number;
  base: number;
  plus1Pct: number;
}

export interface ReportData {
  lifeStyleBudgets: Record<LifeStyle, ReportBudget>;
  requiredCapital: Record<LifeStyle, { capital: number; feasible: boolean }>;
  currentInvestable: number;
  gaps: Record<LifeStyle, number>;
  goalsTable: ReportGoalRow[];
  timeline: {
    currentAge: number;
    targetAge: number;
    yearsToTarget: number;
    planningEndAge: number;
    freedomAge: Record<string, number | null>;
  };
  scenarioComparison: ScenarioComparison;
  sensitivity: SensitivityPoint;
  persona: {
    priorities: string[];
    preferredWorkStyle: string;
    freedomDefinition: string;
    personaKey: string;
  };
  nextActionKey: string;
  assumptions: string[];
}

/** 由 plan 字段推导下一步行动文案 key */
export function deriveNextActionKey(
  plan: FFPlan,
  lifeStyle: LifeStyle,
  comparison: ScenarioComparison,
): string {
  const base = comparison[BASELINE_SCENARIO.id];
  const gap = Math.max(0, (base?.requiredCapital ?? 0) - plan.financialAssets.investable);

  if (gap <= 0) return 'action.on-track-keep-savings';
  if (base?.freedomAge != null && base.freedomAge <= plan.targetAge) return 'action.on-track-keep-savings';

  const yearsAhead = plan.targetAge - plan.currentAge;
  if (yearsAhead > 10 && gap > 0) return 'action.raise-savings-rate';

  if (plan.preferredWorkStyle === 'reduce-hours' || plan.preferredWorkStyle === 'switch-career') {
    return 'action.design-partial-work';
  }
  if (plan.freedomDefinition === 'time-freedom') return 'action.trim-budget';
  if (plan.freedomDefinition === 'passive-income-covers-spending') return 'action.grow-passive-income';
  if (plan.freedomDefinition === 'never-work-again') return 'action.optimize-withdrawal-plan';
  return 'action.stay-the-course';
}

/** 由优先级 / 工作风格 / 自由定义推导人生画像 key */
export function derivePersonaKey(plan: FFPlan): string {
  const p = (plan.topLifePriorities.length > 0 ? plan.topLifePriorities : plan.lifePriorities).join('-');
  return `persona.${p || 'general'}.${plan.preferredWorkStyle}.${plan.freedomDefinition}`;
}

function sensitivityFor(plan: FFPlan, lifeStyle: LifeStyle): SensitivityPoint {
  const perturb = (delta: number) => {
    const s: Scenario = {
      ...BASELINE_SCENARIO,
      id: `${BASELINE_SCENARIO.id}-perturbed`,
      nominalReturn: BASELINE_SCENARIO.nominalReturn + delta,
    };
    return findRequiredCapital(plan, s, lifeStyle).capital;
  };
  return {
    minus1Pct: perturb(-0.01),
    base: perturb(0),
    plus1Pct: perturb(0.01),
  };
}

export function buildReport(
  plan: FFPlan,
  lifeStyle: LifeStyle = 'comfortable',
  comparison?: ScenarioComparison,
): ReportData {
  const cmp = comparison ?? compareScenarios(plan, lifeStyle);

  const budgets: Record<LifeStyle, ReportBudget> = {
    basic: { monthly: plan.basicMonthlyBudget, annual: plan.basicMonthlyBudget * 12 },
    comfortable: { monthly: plan.comfortableMonthlyBudget, annual: plan.comfortableMonthlyBudget * 12 },
    ideal: { monthly: plan.idealMonthlyBudget, annual: plan.idealMonthlyBudget * 12 },
  };

  const requiredCapital: ReportData['requiredCapital'] = {
    basic: { capital: 0, feasible: true },
    comfortable: { capital: 0, feasible: true },
    ideal: { capital: 0, feasible: true },
  };
  for (const ls of ['basic', 'comfortable', 'ideal'] as LifeStyle[]) {
    const r = findRequiredCapital(plan, BASELINE_SCENARIO, ls);
    requiredCapital[ls] = { capital: r.capital, feasible: r.feasible };
  }

  const gaps: Record<LifeStyle, number> = {
    basic: Math.max(0, requiredCapital.basic.capital - plan.financialAssets.investable),
    comfortable: Math.max(0, requiredCapital.comfortable.capital - plan.financialAssets.investable),
    ideal: Math.max(0, requiredCapital.ideal.capital - plan.financialAssets.investable),
  };

  const freedomAge: Record<string, number | null> = {};
  for (const [id, entry] of Object.entries(cmp)) {
    freedomAge[id] = entry.freedomAge;
  }

  return {
    lifeStyleBudgets: budgets,
    requiredCapital,
    currentInvestable: plan.financialAssets.investable,
    gaps,
    goalsTable: plan.lifeGoals.map((g) => ({
      id: g.id,
      title: g.title,
      targetAge: g.targetAge,
      type: g.type,
      todayCost: g.todayCost,
      totalCost: goalTotalCost(g),
      fundingSource: g.fundingSource,
      importance: g.importance,
      drawsFromAssets: goalDrawsFromAssets(g),
    })),
    timeline: {
      currentAge: plan.currentAge,
      targetAge: plan.targetAge,
      yearsToTarget: Math.max(0, plan.targetAge - plan.currentAge),
      planningEndAge: plan.planningEndAge,
      freedomAge,
    },
    scenarioComparison: cmp,
    sensitivity: sensitivityFor(plan, lifeStyle),
    persona: {
      priorities: plan.topLifePriorities.length > 0 ? plan.topLifePriorities : plan.lifePriorities,
      preferredWorkStyle: plan.preferredWorkStyle,
      freedomDefinition: plan.freedomDefinition,
      personaKey: derivePersonaKey(plan),
    },
    nextActionKey: deriveNextActionKey(plan, lifeStyle, cmp),
    assumptions: [
      '全部金额按今天实际购买力记账，收益率使用扣除通胀后的实际收益率',
      '自住房市值默认不计入可投资资产',
      '应急金独立展示，不作为自由期可提款资产',
      '退休账户与受限资产暂不计入模拟起点',
      '已标记 alreadyIncluded 的收入不重复计入',
      '自由期收入仅在其有效年龄区间内计入',
      'W_t = max(0, 生活预算 + 目标支出 - 其他收入)，缺口为负时按 0 处理',
    ],
  };
}
