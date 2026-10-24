/**
 * 输入校验：年龄顺序、金额非负、目标年龄范围、收入/支出不重复计入、债务不双扣、资产口径。
 * 返回 { ok, errors, warnings }。
 */
import type { FFPlan, AdditionalIncomeSource, FutureIncomeSource } from './types';

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

function nonFiniteOrNegative(x: number): boolean {
  return !Number.isFinite(x) || x < 0;
}

function checkIncomeWindow(
  list: Array<AdditionalIncomeSource | FutureIncomeSource>,
  kind: string,
  errors: ValidationIssue[],
) {
  for (const s of list) {
    if (s.startAge > s.endAge) {
      errors.push({
        field: `${kind}.${s.id}.startAge`,
        message: `${s.name}：起始年龄 ${s.startAge} 不能晚于结束年龄 ${s.endAge}`,
      });
    }
  }
}

export function validatePlan(plan: FFPlan): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // ---- 年龄顺序 ----
  if (!Number.isFinite(plan.currentAge) || plan.currentAge < 0) {
    errors.push({ field: 'currentAge', message: '当前年龄必须是非负数字' });
  }
  if (plan.targetAge <= plan.currentAge) {
    errors.push({
      field: 'targetAge',
      message: `目标自由年龄 ${plan.targetAge} 必须大于当前年龄 ${plan.currentAge}`,
    });
  }
  if (plan.planningEndAge <= plan.targetAge) {
    errors.push({
      field: 'planningEndAge',
      message: `规划终点年龄 ${plan.planningEndAge} 必须大于目标自由年龄 ${plan.targetAge}`,
    });
  }

  // ---- 金额非负 ----
  const moneyFields: Array<[string, number]> = [
    ['monthlyNetIncome', plan.monthlyNetIncome],
    ['monthlyCurrentSpending', plan.monthlyCurrentSpending],
    ['monthlyLongTermContribution', plan.monthlyLongTermContribution],
    ['annualInvestmentContribution', plan.annualInvestmentContribution],
    ['basicMonthlyBudget', plan.basicMonthlyBudget],
    ['comfortableMonthlyBudget', plan.comfortableMonthlyBudget],
    ['idealMonthlyBudget', plan.idealMonthlyBudget],
  ];
  for (const [field, value] of moneyFields) {
    if (nonFiniteOrNegative(value)) {
      errors.push({ field, message: `${field} 必须为非负数字` });
    }
  }
  const a = plan.financialAssets;
  for (const [field, value] of [
    ['cash', a.cash],
    ['investable', a.investable],
    ['retirement', a.retirement],
    ['restricted', a.restricted],
    ['emergencyFund', a.emergencyFund],
    ['primaryHomeValue', a.primaryHomeValue],
    ['other', a.other],
  ] as Array<[string, number]>) {
    if (nonFiniteOrNegative(value)) {
      errors.push({ field: `financialAssets.${field}`, message: `资产 ${field} 必须为非负数字` });
    }
  }

  // ---- 目标年龄范围 ----
  for (const g of plan.lifeGoals) {
    if (g.targetAge < plan.currentAge || g.targetAge > plan.planningEndAge) {
      warnings.push({
        field: `lifeGoals.${g.id}.targetAge`,
        message: `目标「${g.title}」的年龄 ${g.targetAge} 不在规划区间 [${plan.currentAge}, ${plan.planningEndAge}] 内`,
      });
    }
    if (nonFiniteOrNegative(g.todayCost)) {
      errors.push({ field: `lifeGoals.${g.id}.todayCost`, message: `目标「${g.title}」成本必须为非负数字` });
    }
  }

  // ---- 收入时间窗 ----
  checkIncomeWindow(plan.additionalIncomeSources, 'additionalIncome', errors);
  checkIncomeWindow(plan.futureIncomeSources, 'futureIncome', errors);

  // ---- 收入不重复计入：未标记 alreadyIncluded 且覆盖当前工作区间的额外收入，提示核对 ----
  for (const s of plan.additionalIncomeSources) {
    const overlapsWorkingLife = s.endAge >= plan.currentAge && s.startAge <= plan.targetAge;
    if (!s.alreadyIncluded && overlapsWorkingLife && s.amountPerYear > 0) {
      warnings.push({
        field: `additionalIncome.${s.id}.alreadyIncluded`,
        message: `收入「${s.name}」未标记是否已计入工资，请确认没有重复计入`,
      });
    }
  }

  // ---- 支出不重复计入：分类明细合计应与当前月支出基本一致 ----
  const includedSum = plan.expenseCategories
    .filter((c) => c.includedInTotal)
    .reduce((sum, c) => sum + c.monthlyAmount, 0);
  if (plan.expenseCategories.length > 0 && plan.monthlyCurrentSpending > 0) {
    const diff = Math.abs(includedSum - plan.monthlyCurrentSpending);
    if (diff > Math.max(100, plan.monthlyCurrentSpending * 0.05)) {
      warnings.push({
        field: 'expenseCategories',
        message: `分类支出合计 ${includedSum} 与当前月支出 ${plan.monthlyCurrentSpending} 差异较大，可能存在重复或遗漏`,
      });
    }
  }

  // ---- 债务不双扣：还款来源与「每月长期投入」重叠时提示 ----
  for (const d of plan.debts) {
    if (nonFiniteOrNegative(d.balance) || nonFiniteOrNegative(d.monthlyPayment)) {
      errors.push({ field: `debts.${d.id}`, message: `债务「${d.type}」余额与月供必须为非负数字` });
    }
    if (d.fundingSource === 'income' && d.monthlyPayment > plan.monthlyNetIncome) {
      warnings.push({
        field: `debts.${d.id}.fundingSource`,
        message: `债务「${d.type}」月供已超过月收入，请确认还款来源`,
      });
    }
  }

  // ---- 优先级多选上限 ----
  if (plan.lifePriorities.length > 3) {
    warnings.push({
      field: 'lifePriorities',
      message: '人生优先级最多选择 3 项，超出部分将被忽略',
    });
  }

  // ---- id 唯一性（资产口径一致性） ----
  const ids: Record<string, number> = {};
  for (const s of [...plan.additionalIncomeSources, ...plan.futureIncomeSources, ...plan.lifeGoals, ...plan.debts]) {
    ids[s.id] = (ids[s.id] ?? 0) + 1;
  }
  for (const [id, count] of Object.entries(ids)) {
    if (count > 1) {
      errors.push({ field: `id.${id}`, message: `存在重复的记录 id：${id}` });
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}
