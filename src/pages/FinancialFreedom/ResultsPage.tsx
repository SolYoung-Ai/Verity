/**
 * 结果页：三方案 tab + Freedom Map + 9 章报告 + 敏感性面板 + 打印导出。
 * 所有数字来自 compareScenarios / buildReport / findRequiredCapital。
 */
import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Printer, RotateCcw, Pencil, AlertTriangle } from 'lucide-react';
import type { FFPlan, LifeStyle } from '@/financial-freedom/types';
import { compareScenarios } from '@/financial-freedom/scenarios';
import { buildReport } from '@/financial-freedom/report-engine';
import { formatCurrency, formatPercent } from '@/financial-freedom/formatters';
import { ResultSection } from '@/components/assessment/ResultLayout';
import FreedomMap from './FreedomMap';
import SensitivityPanel from './SensitivityPanel';
import {
  NEXT_ACTION_COPY,
  WORK_STYLE_LABELS,
  FREEDOM_DEF_LABELS,
  priorityLabel,
} from './reportTexts';
import { cn } from '@/lib/utils';

const LIFESTYLE_TABS: { value: LifeStyle; label: string }[] = [
  { value: 'basic', label: '基本' },
  { value: 'comfortable', label: '舒适' },
  { value: 'ideal', label: '理想' },
];

interface Props {
  plan: FFPlan;
  onRestart: () => void;
  onBackEdit: () => void;
}

export default function ResultsPage({ plan, onRestart, onBackEdit }: Props) {
  const [lifeStyle, setLifeStyle] = useState<LifeStyle>('comfortable');
  const reduced = useReducedMotion();
  const c = plan.currency;

  const comparison = useMemo(() => compareScenarios(plan, lifeStyle), [plan, lifeStyle]);
  const report = useMemo(
    () => buildReport(plan, lifeStyle, comparison),
    [plan, lifeStyle, comparison],
  );

  const req = report.requiredCapital[lifeStyle];
  const gap = report.gaps[lifeStyle];
  const budget = report.lifeStyleBudgets[lifeStyle];

  const nextAction = NEXT_ACTION_COPY[report.nextActionKey] ?? NEXT_ACTION_COPY['action.stay-the-course'];

  const handleRestart = () => {
    if (window.confirm('确定要清除已填写的所有数据，重新开始吗？')) {
      onRestart();
    }
  };

  return (
    <motion.main
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto w-full max-w-3xl px-4 py-10 md:py-16"
    >
      {/* 打印样式：打印时隐藏站点导航 / 页脚 / 操作按钮 */}
      <style>{`
        @media print {
          header, footer { display: none !important; }
          .ff-no-print { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>

      <div className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground print:hidden">
        VERITY · FINANCIAL PLANNER
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        你的自由生活，需要多少财务底气？
      </h1>

      {plan.demoMode && (
        <div className="ff-no-print mt-5 flex items-start gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          当前使用演示数据，并非你的个人财务结果。
        </div>
      )}

      {/* 操作条 */}
      <div className="ff-no-print mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onBackEdit}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Pencil className="h-3.5 w-3.5" /> 回去修改
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Printer className="h-3.5 w-3.5" /> 打印 / 导出 PDF
        </button>
        <button
          type="button"
          onClick={handleRestart}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors hover:text-destructive"
        >
          <RotateCcw className="h-3.5 w-3.5" /> 重新开始
        </button>
      </div>

      {/* 三方案 tab */}
      <div className="ff-no-print mt-8 inline-flex rounded-full border border-border p-1">
        {LIFESTYLE_TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setLifeStyle(t.value)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm transition-colors',
              lifeStyle === t.value
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}生活
          </button>
        ))}
      </div>

      {/* 核心数字 */}
      <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        <div className="bg-card p-5">
          <div className="text-xs text-muted-foreground">月预算（{LIFESTYLE_TABS.find((t) => t.value === lifeStyle)?.label}）</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(budget.monthly, c)}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">年预算 {formatCurrency(budget.annual, c)}</div>
        </div>
        <div className="bg-card p-5">
          <div className="text-xs text-muted-foreground">目标可投资资产</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums text-[var(--verity-accent)]">
            {req.feasible ? formatCurrency(req.capital, c) : '超出测算范围'}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">基准情景下</div>
        </div>
        <div className="bg-card p-5">
          <div className="text-xs text-muted-foreground">当前可投资资产 / 差额</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(report.currentInvestable, c)}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            还需 {gap > 0 ? formatCurrency(gap, c) : '已达标'}
          </div>
        </div>
      </div>

      {/* Freedom Map */}
      <ResultSection eyebrow="MAP" title="Financial Freedom Map">
        <p className="mb-4 text-sm text-muted-foreground">
          深色曲线是你的可投资资产随年龄变化的路径；橙色虚线是这档生活需要的目标本金；
          纵轴上的标记是你定下的人生目标。曲线跨过目标线、且能维持到 {report.timeline.planningEndAge} 岁，才算真正自由。
        </p>
        <FreedomMap
          plan={plan}
          comparison={comparison}
          lifeStyle={lifeStyle}
          requiredCapital={req.capital}
        />
      </ResultSection>

      {/* 第 1 章 预算解释 */}
      <ResultSection eyebrow="01 · BUDGET" title="你想要的生活，值多少钱">
        <div className="grid gap-3 sm:grid-cols-3">
          {(['basic', 'comfortable', 'ideal'] as LifeStyle[]).map((ls) => (
            <button
              key={ls}
              type="button"
              onClick={() => setLifeStyle(ls)}
              className={cn(
                'rounded-lg border p-4 text-left transition-colors',
                lifeStyle === ls ? 'border-foreground bg-foreground/[0.03]' : 'border-border hover:border-foreground/30',
              )}
            >
              <div className="text-xs text-muted-foreground">{LIFESTYLE_TABS.find((t) => t.value === ls)?.label}生活</div>
              <div className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(report.lifeStyleBudgets[ls].monthly, c)}</div>
              <div className="text-xs text-muted-foreground">{formatCurrency(report.lifeStyleBudgets[ls].annual, c)} / 年</div>
            </button>
          ))}
        </div>
      </ResultSection>

      {/* 第 2 章 需要多少资产 */}
      <ResultSection eyebrow="02 · TARGET CAPITAL" title="这档生活需要多少本金">
        <p className="text-sm leading-relaxed text-muted-foreground">
          计算引擎以「从自由年龄到 {report.timeline.planningEndAge} 岁，资产全程不透支」为标准，反推出今天需要的可投资本金。
          当前选中的是「{LIFESTYLE_TABS.find((t) => t.value === lifeStyle)?.label}」档：
        </p>
        <div className="mt-3 text-3xl font-semibold tabular-nums text-[var(--verity-accent)]">
          {req.feasible ? formatCurrency(req.capital, c) : '在测算范围内无法达成'}
        </div>
      </ResultSection>

      {/* 第 3 章 目标价格表 */}
      <ResultSection eyebrow="03 · GOALS" title="你的人生目标价格表">
        {report.goalsTable.length === 0 ? (
          <p className="text-sm text-muted-foreground">你没有填写人生目标。补充目标后，这里会列出它们的价格与出资方式。</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 font-medium">目标</th>
                <th className="py-2 font-medium">年龄</th>
                <th className="py-2 text-right font-medium">今日总价</th>
                <th className="py-2 font-medium">出资</th>
              </tr>
            </thead>
            <tbody>
              {report.goalsTable.map((g) => (
                <tr key={g.id} className="border-b border-border/60">
                  <td className="py-2.5">{g.title}</td>
                  <td className="py-2.5 tabular-nums text-muted-foreground">{g.targetAge} 岁</td>
                  <td className="py-2.5 text-right tabular-nums">{formatCurrency(g.totalCost, c)}</td>
                  <td className="py-2.5 text-xs text-muted-foreground">
                    {g.drawsFromAssets ? '由资产支付' : '不影响资产'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ResultSection>

      {/* 第 4 章 距离目标 */}
      <ResultSection eyebrow="04 · GAP" title="你离目标还有多远">
        <p className="text-sm leading-relaxed text-muted-foreground">
          从 {report.timeline.currentAge} 岁到 {report.timeline.targetAge} 岁，还有{' '}
          {report.timeline.yearsToTarget} 年。
          三档生活各自的资金缺口为：
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {(['basic', 'comfortable', 'ideal'] as LifeStyle[]).map((ls) => (
            <div key={ls} className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground">{LIFESTYLE_TABS.find((t) => t.value === ls)?.label}</div>
              <div className="mt-1 text-lg font-semibold tabular-nums">
                {report.gaps[ls] > 0 ? `还差 ${formatCurrency(report.gaps[ls], c)}` : '已达标'}
              </div>
            </div>
          ))}
        </div>
      </ResultSection>

      {/* 第 5 章 情景对比 */}
      <ResultSection eyebrow="05 · SCENARIOS" title="三种收益率假设下对比">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="py-2 font-medium">情景</th>
              <th className="py-2 font-medium">名义 / 通胀</th>
              <th className="py-2 text-right font-medium">所需本金</th>
              <th className="py-2 text-right font-medium">预计自由年龄</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(report.scenarioComparison).map((e) => (
              <tr key={e.scenario.id} className="border-b border-border/60">
                <td className="py-2.5 font-medium">
                  {e.scenario.id === 'conservative' ? '保守' : e.scenario.id === 'baseline' ? '基准' : '乐观'}
                </td>
                <td className="py-2.5 tabular-nums text-muted-foreground">
                  {formatPercent(e.scenario.nominalReturn)} / {formatPercent(e.scenario.inflation)}
                </td>
                <td className="py-2.5 text-right tabular-nums">
                  {e.requiredCapitalFeasible ? formatCurrency(e.requiredCapital, c) : '不可行'}
                </td>
                <td className="py-2.5 text-right tabular-nums">
                  {e.freedomAge != null ? `${e.freedomAge} 岁` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted-foreground">
          这是情景模拟，不是收益承诺。实际结果会随市场波动，请勿据此预测个人收益。
        </p>
      </ResultSection>

      {/* 第 6 章 敏感性 */}
      <ResultSection eyebrow="06 · SENSITIVITY" title="哪个杠杆最管用">
        <div className="mb-3 grid gap-3 rounded-lg border border-border p-4 text-sm sm:grid-cols-3">
          <div>
            <div className="text-xs text-muted-foreground">收益率 -1%</div>
            <div className="mt-0.5 tabular-nums">{formatCurrency(report.sensitivity.minus1Pct, c)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">基准</div>
            <div className="mt-0.5 tabular-nums">{formatCurrency(report.sensitivity.base, c)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">收益率 +1%</div>
            <div className="mt-0.5 tabular-nums">{formatCurrency(report.sensitivity.plus1Pct, c)}</div>
          </div>
        </div>
        <div className="ff-no-print">
          <SensitivityPanel plan={plan} lifeStyle={lifeStyle} />
        </div>
      </ResultSection>

      {/* 第 7 章 人生优先级画像 */}
      <ResultSection eyebrow="07 · PROFILE" title="你的人生优先级画像">
        <p className="text-sm leading-relaxed text-muted-foreground">
          你最看重的是{' '}
          <strong className="font-medium text-foreground">
            {report.persona.priorities.map(priorityLabel).join('、') || '尚未明确'}
          </strong>
          ；实现自由后你更倾向「{WORK_STYLE_LABELS[report.persona.preferredWorkStyle] ?? report.persona.preferredWorkStyle}」；
          你心中的自由是「{FREEDOM_DEF_LABELS[report.persona.freedomDefinition] ?? report.persona.freedomDefinition}」。
        </p>
      </ResultSection>

      {/* 第 8 章 下一步 */}
      <ResultSection eyebrow="08 · NEXT" title="下一步行动">
        <div className="rounded-lg border-l-2 border-[var(--verity-accent)] bg-foreground/[0.02] p-4">
          <div className="text-sm font-semibold">{nextAction.title}</div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{nextAction.body}</p>
        </div>
      </ResultSection>

      {/* 第 9 章 假设与限制 */}
      <ResultSection eyebrow="09 · ASSUMPTIONS" title="假设与限制">
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {report.assumptions.map((a, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden>•</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          本工具基于你的输入与固定收益率假设做情景模拟，不构成任何投资建议或收益承诺。
          市场有风险，重大财务决策请咨询持牌专业人士。
        </p>
      </ResultSection>

      <p className="mt-16 text-center text-xs text-muted-foreground print:hidden">
        VERITY · 财务规划工具 · 数据仅保存在本机
      </p>
    </motion.main>
  );
}
