/**
 * 02 当前财务：年龄 / 家庭 / 收入 / 支出 / 资产 / 债务 / 投入。
 * 自住房与应急金单独展示，不计入可投资资产。
 */
import { FieldShell, MoneyInput, AgeInput, OptionCards, SubTable, uid } from '../fields';
import { StepHeading, StepBody, type StepProps } from './common';
import { HOUSEHOLD_OPTIONS } from '../options';
import type {
  AdditionalIncomeSource,
  Debt,
  ExpenseCategory,
} from '@/financial-freedom/types';

export default function StepFinances({ plan, update, updateAsset }: StepProps) {
  const cur = plan.currency;

  /* ---- 额外收入子表 ---- */
  const addIncome = (): AdditionalIncomeSource => ({
    id: uid('inc'),
    name: '',
    amountPerYear: 0,
    frequency: 'monthly',
    startAge: plan.currentAge || 0,
    endAge: plan.targetAge || 65,
    isAfterCostTax: true,
    alreadyIncluded: false,
  });

  /* ---- 债务子表 ---- */
  const addDebt = (): Debt => ({
    id: uid('debt'),
    type: '',
    balance: 0,
    monthlyPayment: 0,
    prepayPlan: 'none',
    fundingSource: 'income',
  });

  /* ---- 支出分类子表 ---- */
  const addExpense = (): ExpenseCategory => ({
    key: uid('exp'),
    label: '',
    monthlyAmount: 0,
    includedInTotal: true,
  });

  return (
    <div>
      <StepHeading
        eyebrow="02 · 当前财务"
        title="你现在站在哪里？"
        desc="金额都填税后、今天的实际数字。自住房和应急金会单独列示，不会被算进可投资资产。"
      />
      <StepBody>
        {/* 年龄与家庭 */}
        <div className="grid gap-4 sm:grid-cols-3">
          <FieldShell label="当前年龄">
            <AgeInput value={plan.currentAge} onChange={(n) => update({ currentAge: n })} />
          </FieldShell>
          <FieldShell label="目标自由年龄">
            <AgeInput value={plan.targetAge} onChange={(n) => update({ targetAge: n })} />
          </FieldShell>
          <FieldShell label="规划终点年龄" hint="算到多少岁">
            <AgeInput value={plan.planningEndAge} onChange={(n) => update({ planningEndAge: n })} />
          </FieldShell>
        </div>

        <FieldShell label="家庭结构">
          <OptionCards
            options={HOUSEHOLD_OPTIONS}
            value={plan.householdType}
            onChange={(v) => update({ householdType: v })}
          />
        </FieldShell>

        {/* 收入 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldShell label="当前税后月收入" hint="每月到手">
            <MoneyInput value={plan.monthlyNetIncome} currency={cur} onChange={(n) => update({ monthlyNetIncome: n })} />
          </FieldShell>
          <FieldShell label="当前月支出" hint="所有开销合计">
            <MoneyInput value={plan.monthlyCurrentSpending} currency={cur} onChange={(n) => update({ monthlyCurrentSpending: n })} />
          </FieldShell>
        </div>

        {/* 资产 */}
        <div>
          <div className="mb-3 text-sm font-medium">资产盘点</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldShell label="可投资资产" hint="模拟起点，最重要">
              <MoneyInput value={plan.financialAssets.investable} currency={cur} onChange={(n) => updateAsset('investable', n)} />
            </FieldShell>
            <FieldShell label="活期现金">
              <MoneyInput value={plan.financialAssets.cash} currency={cur} onChange={(n) => updateAsset('cash', n)} />
            </FieldShell>
            <FieldShell label="应急金" hint="独立显示，不当作可提款资产">
              <MoneyInput value={plan.financialAssets.emergencyFund} currency={cur} onChange={(n) => updateAsset('emergencyFund', n)} />
            </FieldShell>
            <FieldShell label="自住房市值" hint="默认不计入可投资资产">
              <MoneyInput value={plan.financialAssets.primaryHomeValue} currency={cur} onChange={(n) => updateAsset('primaryHomeValue', n)} />
            </FieldShell>
            <FieldShell label="退休账户" hint="暂不计入模拟起点">
              <MoneyInput value={plan.financialAssets.retirement} currency={cur} onChange={(n) => updateAsset('retirement', n)} />
            </FieldShell>
            <FieldShell label="受限资产 / 其他">
              <MoneyInput value={plan.financialAssets.restricted} currency={cur} onChange={(n) => updateAsset('restricted', n)} />
            </FieldShell>
          </div>
        </div>

        {/* 投入 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldShell label="每月长期投入" hint="定投 / 强制储蓄">
            <MoneyInput value={plan.monthlyLongTermContribution} currency={cur} onChange={(n) => update({ monthlyLongTermContribution: n })} />
          </FieldShell>
          <FieldShell label="每年追加投资" hint="年终奖 / 一次性投入">
            <MoneyInput value={plan.annualInvestmentContribution} currency={cur} onChange={(n) => update({ annualInvestmentContribution: n })} />
          </FieldShell>
        </div>

        {/* 额外收入子表 */}
        <FieldShell label="积累期额外收入" hint="副业 / 租金等；已含在工资里请勾选「已计入」">
          <SubTable<AdditionalIncomeSource>
            rows={plan.additionalIncomeSources}
            getId={(r) => r.id}
            emptyText="没有额外收入就留空"
            addLabel="添加一笔额外收入"
            onAdd={() => update({ additionalIncomeSources: [...plan.additionalIncomeSources, addIncome()] })}
            onRemove={(id) => update({ additionalIncomeSources: plan.additionalIncomeSources.filter((r) => r.id !== id) })}
            onRowChange={(id, patch) =>
              update({
                additionalIncomeSources: plan.additionalIncomeSources.map((r) =>
                  r.id === id ? { ...r, ...patch } : r,
                ),
              })
            }
            renderRow={({ row, onChange }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="h-10 rounded-md border border-input px-3 text-sm outline-none focus:border-foreground/40"
                  placeholder="名称（如：自媒体）"
                  value={row.name}
                  onChange={(e) => onChange({ name: e.target.value })}
                />
                <MoneyInput value={row.amountPerYear} currency={cur} onChange={(n) => onChange({ amountPerYear: n })} />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="tabular-nums">{row.startAge} 岁</span>开始
                  <input
                    type="range" min={0} max={100} value={row.startAge}
                    onChange={(e) => onChange({ startAge: parseInt(e.target.value, 10) })}
                    className="flex-1 accent-[var(--verity-accent)]"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  到<span className="tabular-nums">{row.endAge} 岁</span>
                  <input
                    type="range" min={0} max={100} value={row.endAge}
                    onChange={(e) => onChange({ endAge: parseInt(e.target.value, 10) })}
                    className="flex-1 accent-[var(--verity-accent)]"
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={row.alreadyIncluded}
                    onChange={(e) => onChange({ alreadyIncluded: e.target.checked })}
                    className="accent-[var(--verity-accent)]"
                  />
                  这笔收入已经包含在月工资里（勾选后计算时不重复加）
                </label>
              </div>
            )}
          />
        </FieldShell>

        {/* 债务子表 */}
        <FieldShell label="负债" hint="月供会在积累期从投入中扣除">
          <SubTable<Debt>
            rows={plan.debts}
            getId={(r) => r.id}
            emptyText="没有负债就留空"
            addLabel="添加一笔负债"
            onAdd={() => update({ debts: [...plan.debts, addDebt()] })}
            onRemove={(id) => update({ debts: plan.debts.filter((r) => r.id !== id) })}
            onRowChange={(id, patch) =>
              update({ debts: plan.debts.map((r) => (r.id === id ? { ...r, ...patch } : r)) })
            }
            renderRow={({ row, onChange }) => (
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  className="h-10 rounded-md border border-input px-3 text-sm outline-none focus:border-foreground/40"
                  placeholder="类型（房贷 / 车贷 / 信用卡…）"
                  value={row.type}
                  onChange={(e) => onChange({ type: e.target.value })}
                />
                <FieldShell label="当前余额">
                  <MoneyInput value={row.balance} currency={cur} onChange={(n) => onChange({ balance: n })} />
                </FieldShell>
                <FieldShell label="每月还款">
                  <MoneyInput value={row.monthlyPayment} currency={cur} onChange={(n) => onChange({ monthlyPayment: n })} />
                </FieldShell>
              </div>
            )}
          />
        </FieldShell>

        {/* 支出分类子表（深度） */}
        {plan.expenseCategories.length >= 0 && (
          <FieldShell label="支出分类（可选）" hint="帮助核对月支出是否合理">
            <SubTable<ExpenseCategory>
              rows={plan.expenseCategories}
              getId={(r) => r.key}
              emptyText="不填分类也可以，直接用上面的「当前月支出」即可"
              addLabel="添加一个支出分类"
              onAdd={() => update({ expenseCategories: [...plan.expenseCategories, addExpense()] })}
              onRemove={(id) => update({ expenseCategories: plan.expenseCategories.filter((r) => r.key !== id) })}
              onRowChange={(id, patch) =>
                update({
                  expenseCategories: plan.expenseCategories.map((r) =>
                    r.key === id ? { ...r, ...patch } : r,
                  ),
                })
              }
              renderRow={({ row, onChange }) => (
                <div className="grid items-end gap-3 sm:grid-cols-2">
                  <input
                    className="h-10 rounded-md border border-input px-3 text-sm outline-none focus:border-foreground/40"
                    placeholder="分类名（住房 / 餐饮…）"
                    value={row.label}
                    onChange={(e) => onChange({ label: e.target.value })}
                  />
                  <MoneyInput value={row.monthlyAmount} currency={cur} onChange={(n) => onChange({ monthlyAmount: n })} />
                </div>
              )}
            />
          </FieldShell>
        )}
      </StepBody>
    </div>
  );
}
