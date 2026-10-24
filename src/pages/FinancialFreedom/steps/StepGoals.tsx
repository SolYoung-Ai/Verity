/**
 * 04 人生目标：一次性 / 每年 / 每月 / 持续若干年。
 */
import { FieldShell, MoneyInput, AgeInput, SubTable, uid } from '../fields';
import { StepHeading, StepBody, type StepProps } from './common';
import { GOAL_TYPE_OPTIONS, GOAL_FUNDING_OPTIONS, GOAL_IMPORTANCE_OPTIONS } from '../options';
import type { LifeGoal, LifeGoalType, GoalFundingSource, GoalImportance } from '@/financial-freedom/types';

export default function StepGoals({ plan, update }: StepProps) {
  const cur = plan.currency;
  const add = (): LifeGoal => ({
    id: uid('goal'),
    title: '',
    todayCost: 0,
    targetAge: plan.targetAge || 60,
    type: 'oneTime',
    fundingSource: 'freedomAssets',
    importance: 'want',
  });

  return (
    <div>
      <StepHeading
        eyebrow="04 · 人生目标"
        title="自由之后，你想为自己做点什么？"
        desc="比如一次环球旅行、换个房子、给孩子一笔钱。由资产支付的目标会进入模拟。"
      />
      <StepBody>
        <FieldShell label="你的人生目标" hint="没有就留空">
          <SubTable<LifeGoal>
            rows={plan.lifeGoals}
            getId={(r) => r.id}
            emptyText="还没有目标，直接跳过也可以"
            addLabel="添加一个人生目标"
            onAdd={() => update({ lifeGoals: [...plan.lifeGoals, add()] })}
            onRemove={(id) => update({ lifeGoals: plan.lifeGoals.filter((r) => r.id !== id) })}
            onRowChange={(id, patch) =>
              update({ lifeGoals: plan.lifeGoals.map((r) => (r.id === id ? { ...r, ...patch } : r)) })
            }
            renderRow={({ row, onChange }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="h-10 rounded-md border border-input px-3 text-sm outline-none focus:border-foreground/40"
                  placeholder="目标名称（环球旅行 / 换房…）"
                  value={row.title}
                  onChange={(e) => onChange({ title: e.target.value })}
                />
                <FieldShell label="发生年龄">
                  <AgeInput value={row.targetAge} onChange={(n) => onChange({ targetAge: n })} />
                </FieldShell>
                <FieldShell label="金额（今日币值）">
                  <MoneyInput value={row.todayCost} currency={cur} onChange={(n) => onChange({ todayCost: n })} />
                </FieldShell>
                <FieldShell label="类型">
                  <select
                    className="h-10 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none focus:border-foreground/40"
                    value={row.type}
                    onChange={(e) => onChange({ type: e.target.value as LifeGoalType })}
                  >
                    {GOAL_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </FieldShell>
                {row.type === 'years' && (
                  <FieldShell label="持续年数">
                    <AgeInput
                      value={row.yearsCount ?? 1}
                      onChange={(n) => onChange({ yearsCount: Math.max(1, n) })}
                    />
                  </FieldShell>
                )}
                <FieldShell label="由谁出钱">
                  <select
                    className="h-10 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none focus:border-foreground/40"
                    value={row.fundingSource}
                    onChange={(e) => onChange({ fundingSource: e.target.value as GoalFundingSource })}
                  >
                    {GOAL_FUNDING_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </FieldShell>
                <FieldShell label="重要程度">
                  <select
                    className="h-10 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none focus:border-foreground/40"
                    value={row.importance}
                    onChange={(e) => onChange({ importance: e.target.value as GoalImportance })}
                  >
                    {GOAL_IMPORTANCE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </FieldShell>
              </div>
            )}
          />
        </FieldShell>
      </StepBody>
    </div>
  );
}
