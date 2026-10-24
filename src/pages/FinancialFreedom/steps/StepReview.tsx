/**
 * 07 确认并生成：汇总关键数字 + 校验提示 + 生成按钮。
 */
import { FieldShell } from '../fields';
import { StepHeading, StepBody, type StepProps } from './common';
import { formatCurrency } from '@/financial-freedom/formatters';
import type { ValidationResult } from '@/financial-freedom/validation';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2.5 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

export default function StepReview({
  plan,
  validation,
}: StepProps & { validation: ValidationResult }) {
  const c = plan.currency;
  return (
    <div>
      <StepHeading
        eyebrow="07 · 确认"
        title="最后核对一遍，然后生成你的数字"
        desc="所有结果都由下面这些输入实时计算得出，没有任何写死的结论。"
      />
      <StepBody>
        <div className="rounded-lg border border-border p-5">
          <Row label="年龄路径" value={`${plan.currentAge} 岁 → 目标 ${plan.targetAge} 岁 → 规划到 ${plan.planningEndAge} 岁`} />
          <Row label="月税后收入" value={formatCurrency(plan.monthlyNetIncome, c)} />
          <Row label="当前月支出" value={formatCurrency(plan.monthlyCurrentSpending, c)} />
          <Row label="可投资资产" value={formatCurrency(plan.financialAssets.investable, c)} />
          <Row label="每月长期投入" value={formatCurrency(plan.monthlyLongTermContribution, c)} />
          <Row label="基本 / 舒适 / 理想月预算" value={`${formatCurrency(plan.basicMonthlyBudget, c)} / ${formatCurrency(plan.comfortableMonthlyBudget, c)} / ${formatCurrency(plan.idealMonthlyBudget, c)}`} />
          <Row label="人生目标数" value={`${plan.lifeGoals.length} 项`} />
          <Row label="自由期收入源" value={`${plan.futureIncomeSources.length} 项`} />
        </div>

        {validation.errors.length > 0 && (
          <FieldShell label="需要修正的问题" error="">
            <ul className="space-y-1.5 text-sm text-destructive">
              {validation.errors.map((e) => (
                <li key={e.field} className="flex gap-2">
                  <span aria-hidden>•</span>
                  <span>{e.message}</span>
                </li>
              ))}
            </ul>
          </FieldShell>
        )}
        {validation.warnings.length > 0 && (
          <FieldShell label="提醒（不影响生成）">
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {validation.warnings.slice(0, 6).map((w, i) => (
                <li key={`${w.field}-${i}`} className="flex gap-2">
                  <span aria-hidden>•</span>
                  <span>{w.message}</span>
                </li>
              ))}
            </ul>
          </FieldShell>
        )}
      </StepBody>
    </div>
  );
}
