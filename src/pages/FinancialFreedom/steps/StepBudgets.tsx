/**
 * 03 三种生活预算：基本 / 舒适 / 理想，月度。
 */
import { FieldShell, MoneyInput } from '../fields';
import { StepHeading, StepBody, type StepProps } from './common';

export default function StepBudgets({ plan, update }: StepProps) {
  const cur = plan.currency;
  return (
    <div>
      <StepHeading
        eyebrow="03 · 三种生活"
        title="自由后，你想过哪种日子？"
        desc="按今天的物价，三档生活各自需要的月开销。结果页会分别算出每档需要的本金。"
      />
      <StepBody>
        <FieldShell label="基本生活" hint="够用、不窘迫，克制但不委屈">
          <MoneyInput value={plan.basicMonthlyBudget} currency={cur} onChange={(n) => update({ basicMonthlyBudget: n })} />
        </FieldShell>
        <FieldShell label="舒适生活" hint="有品质、偶尔享受，这是你的基准线">
          <MoneyInput value={plan.comfortableMonthlyBudget} currency={cur} onChange={(n) => update({ comfortableMonthlyBudget: n })} />
        </FieldShell>
        <FieldShell label="理想生活" hint="想过就过、不必看价格">
          <MoneyInput value={plan.idealMonthlyBudget} currency={cur} onChange={(n) => update({ idealMonthlyBudget: n })} />
        </FieldShell>
      </StepBody>
    </div>
  );
}
