/**
 * 06 规划假设：投入增长方式、应急月数、初始提款率、币种。
 */
import { FieldShell, OptionCards } from '../fields';
import { StepHeading, StepBody, type StepProps } from './common';
import { CONTRIBUTION_GROWTH_OPTIONS, CURRENCY_OPTIONS } from '../options';
import type { Currency } from '@/financial-freedom/types';

export default function StepAssumptions({ plan, update }: StepProps) {
  return (
    <div>
      <StepHeading
        eyebrow="06 · 规划假设"
        title="几个关键假设"
        desc="这些有默认值，不确定就保持默认。三档收益率由计算引擎给定，不要自己拍脑袋。"
      />
      <StepBody>
        <FieldShell label="每月长期投入如何增长？">
          <OptionCards
            options={CONTRIBUTION_GROWTH_OPTIONS}
            value={plan.contributionGrowth}
            onChange={(v) => update({ contributionGrowth: v })}
          />
        </FieldShell>

        {plan.contributionGrowth === 'custom' && (
          <FieldShell label="自定义年增长率（名义）" hint="填 5 表示每年多投 5%">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={50}
              value={(plan.customContributionGrowth ?? 0) * 100}
              onChange={(e) => {
                const n = parseFloat(e.target.value);
                update({ customContributionGrowth: Number.isFinite(n) ? n / 100 : 0 });
              }}
              className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm tabular-nums outline-none focus:border-foreground/40"
            />
          </FieldShell>
        )}

        <FieldShell label={`应急金储备：${plan.emergencyMonths} 个月支出`}>
          <input
            type="range" min={3} max={24} step={1}
            value={plan.emergencyMonths}
            onChange={(e) => update({ emergencyMonths: parseInt(e.target.value, 10) })}
            className="w-full accent-[var(--verity-accent)]"
          />
        </FieldShell>

        <FieldShell label={`参考初始提款率：${(plan.initialWR * 100).toFixed(1)}%`} hint="仅作交叉检查，正式数字由情景模拟给出">
          <input
            type="range" min={0.02} max={0.05} step={0.001}
            value={plan.initialWR}
            onChange={(e) => update({ initialWR: parseFloat(e.target.value) })}
            className="w-full accent-[var(--verity-accent)]"
          />
        </FieldShell>

        <FieldShell label="记账币种">
          <select
            className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:border-foreground/40"
            value={plan.currency}
            onChange={(e) => update({ currency: e.target.value as Currency })}
          >
            {CURRENCY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </FieldShell>
      </StepBody>
    </div>
  );
}
