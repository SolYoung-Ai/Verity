/**
 * 敏感性面板：调整 月投入 / 预算 / 目标年龄 / 收益率，即时重算所需本金与自由年龄。
 * 每次改动都调用 findRequiredCapital / estimateFinancialFreedomAge，不写死结果。
 */
import { useMemo, useState } from 'react';
import type { FFPlan, LifeStyle } from '@/financial-freedom/types';
import { BASELINE_SCENARIO } from '@/financial-freedom/defaults';
import { findRequiredCapital } from '@/financial-freedom/findRequiredCapital';
import { estimateFinancialFreedomAge } from '@/financial-freedom/estimateFreedomAge';
import { formatCurrency, formatPercent } from '@/financial-freedom/formatters';

interface Props {
  plan: FFPlan;
  lifeStyle: LifeStyle;
}

export default function SensitivityPanel({ plan, lifeStyle }: Props) {
  const [contribDelta, setContribDelta] = useState(0); // 每月增减
  const [budgetDelta, setBudgetDelta] = useState(0); // 月预算增减
  const [ageDelta, setAgeDelta] = useState(0); // 目标年龄增减
  const [returnDelta, setReturnDelta] = useState(0); // 名义收益率增减（百分点）

  const result = useMemo(() => {
    const variantPlan: FFPlan = {
      ...plan,
      monthlyLongTermContribution: Math.max(0, plan.monthlyLongTermContribution + contribDelta),
      targetAge: Math.max(plan.currentAge + 1, plan.targetAge + ageDelta),
      basicMonthlyBudget: Math.max(0, plan.basicMonthlyBudget + budgetDelta),
      comfortableMonthlyBudget: Math.max(0, plan.comfortableMonthlyBudget + budgetDelta),
      idealMonthlyBudget: Math.max(0, plan.idealMonthlyBudget + budgetDelta),
    };
    const variantScenario = {
      ...BASELINE_SCENARIO,
      id: 'baseline-sensitive',
      nominalReturn: Math.max(0.01, BASELINE_SCENARIO.nominalReturn + returnDelta),
    };
    const capital = findRequiredCapital(variantPlan, variantScenario, lifeStyle);
    const freedom = estimateFinancialFreedomAge(variantPlan, variantScenario, lifeStyle);
    return {
      capital: capital.capital,
      feasible: capital.feasible,
      freedomAge: freedom.age,
    };
  }, [plan, lifeStyle, contribDelta, budgetDelta, ageDelta, returnDelta]);

  const baseCapital = useMemo(
    () => findRequiredCapital(plan, BASELINE_SCENARIO, lifeStyle).capital,
    [plan, lifeStyle],
  );

  const Slider = ({
    label,
    value,
    set,
    min,
    max,
    step,
    format,
  }: {
    label: string;
    value: number;
    set: (n: number) => void;
    min: number;
    max: number;
    step: number;
    format: (n: number) => string;
  }) => (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => set(parseFloat(e.target.value))}
        className="w-full accent-[var(--verity-accent)]"
      />
    </div>
  );

  return (
    <div className="rounded-lg border border-border p-5">
      <p className="text-xs text-muted-foreground">
        拖动下面的滑杆，看看哪个杠杆对你的目标本金影响最大。结果会即时重算。
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Slider
          label="每月投入增减" value={contribDelta} set={setContribDelta}
          min={-5000} max={20000} step={500}
          format={(n) => `${n >= 0 ? '+' : ''}${formatCurrency(n, plan.currency)}/月`}
        />
        <Slider
          label="月预算增减" value={budgetDelta} set={setBudgetDelta}
          min={-5000} max={15000} step={500}
          format={(n) => `${n >= 0 ? '+' : ''}${formatCurrency(n, plan.currency)}/月`}
        />
        <Slider
          label="目标自由年龄增减" value={ageDelta} set={setAgeDelta}
          min={-10} max={15} step={1}
          format={(n) => `${n >= 0 ? '+' : ''}${n} 岁`}
        />
        <Slider
          label="名义收益率增减" value={returnDelta} set={setReturnDelta}
          min={-0.02} max={0.02} step={0.005}
          format={(n) => `${n >= 0 ? '+' : ''}${formatPercent(n, 1)}`}
        />
      </div>

      <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
        <div>
          <div className="text-xs text-muted-foreground">调整后所需本金</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">
            {result.feasible ? formatCurrency(result.capital, plan.currency) : '超出测算范围'}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            原基准：{formatCurrency(baseCapital, plan.currency)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">调整后预计自由年龄</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">
            {result.freedomAge != null ? `${result.freedomAge} 岁` : '规划期内难以达成'}
          </div>
        </div>
      </div>
    </div>
  );
}
