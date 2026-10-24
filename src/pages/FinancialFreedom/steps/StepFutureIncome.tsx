/**
 * 05 未来收入：自由期的养老金 / 租金 / 副业等。
 */
import { FieldShell, MoneyInput, SubTable, uid } from '../fields';
import { StepHeading, StepBody, type StepProps } from './common';
import type { FutureIncomeSource } from '@/financial-freedom/types';

export default function StepFutureIncome({ plan, update }: StepProps) {
  const cur = plan.currency;
  const add = (): FutureIncomeSource => ({
    id: uid('fut'),
    name: '',
    amountPerYear: 0,
    startAge: 60,
    endAge: plan.planningEndAge || 90,
    netOfTax: true,
    stability: 'medium',
    alreadyIncluded: false,
  });

  return (
    <div>
      <StepHeading
        eyebrow="05 · 未来收入"
        title="自由之后，还有哪些钱会进来？"
        desc="养老金、房租、版税、副业……这些会直接减少你需要从资产里提取的金额。"
      />
      <StepBody>
        <FieldShell label="自由期收入来源" hint="没有就留空">
          <SubTable<FutureIncomeSource>
            rows={plan.futureIncomeSources}
            getId={(r) => r.id}
            emptyText="不填则默认自由期没有任何其他收入"
            addLabel="添加一项未来收入"
            onAdd={() => update({ futureIncomeSources: [...plan.futureIncomeSources, add()] })}
            onRemove={(id) => update({ futureIncomeSources: plan.futureIncomeSources.filter((r) => r.id !== id) })}
            onRowChange={(id, patch) =>
              update({
                futureIncomeSources: plan.futureIncomeSources.map((r) =>
                  r.id === id ? { ...r, ...patch } : r,
                ),
              })
            }
            renderRow={({ row, onChange }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="h-10 rounded-md border border-input px-3 text-sm outline-none focus:border-foreground/40"
                  placeholder="名称（养老金 / 房租…）"
                  value={row.name}
                  onChange={(e) => onChange({ name: e.target.value })}
                />
                <FieldShell label="每年金额（税后）">
                  <MoneyInput value={row.amountPerYear} currency={cur} onChange={(n) => onChange({ amountPerYear: n })} />
                </FieldShell>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="tabular-nums">{row.startAge} 岁</span>开始
                  <input
                    type="range" min={0} max={120} value={row.startAge}
                    onChange={(e) => onChange({ startAge: parseInt(e.target.value, 10) })}
                    className="flex-1 accent-[var(--verity-accent)]"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  到<span className="tabular-nums">{row.endAge} 岁</span>
                  <input
                    type="range" min={0} max={120} value={row.endAge}
                    onChange={(e) => onChange({ endAge: parseInt(e.target.value, 10) })}
                    className="flex-1 accent-[var(--verity-accent)]"
                  />
                </div>
              </div>
            )}
          />
        </FieldShell>
      </StepBody>
    </div>
  );
}
