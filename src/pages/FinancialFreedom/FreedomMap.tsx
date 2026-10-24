/**
 * Financial Freedom Map：资产增长曲线 + 目标资本水平线 + 目标年龄竖线 + 人生目标散点。
 * 所有数字来自 compareScenarios / findRequiredCapital，不写死。
 */
import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { FFPlan, LifeStyle } from '@/financial-freedom/types';
import type { ScenarioComparison } from '@/financial-freedom/scenarios';
import { formatCurrency } from '@/financial-freedom/formatters';
import { goalDrawsFromAssets } from '@/financial-freedom/goals';

interface Props {
  plan: FFPlan;
  comparison: ScenarioComparison;
  lifeStyle: LifeStyle;
  requiredCapital: number;
}

const ACCENT = '#C2410C';
const INK = '#334155';
const GRID = 'rgba(120,113,108,0.18)';

export default function FreedomMap({ plan, comparison, lifeStyle, requiredCapital }: Props) {
  const option = useMemo(() => {
    const base = comparison['baseline'];
    const yearly = base?.yearly ?? [];
    const ages = yearly.map((r) => r.age);
    const assets = yearly.map((r) => Math.round(r.endAssets));

    const goalPoints = plan.lifeGoals
      .filter((g) => goalDrawsFromAssets(g))
      .map((g) => ({
        name: g.title,
        value: [g.targetAge, Math.round(requiredCapital * 0.9)],
        todayCost: g.todayCost,
      }));

    return {
      backgroundColor: 'transparent',
      grid: { left: 16, right: 24, top: 30, bottom: 36, containLabel: true },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderColor: 'rgba(120,113,108,0.3)',
        textStyle: { color: INK, fontSize: 12 },
        valueFormatter: (v: number) => formatCurrency(v as number, plan.currency),
      },
      xAxis: {
        type: 'category',
        data: ages,
        name: '年龄',
        nameLocation: 'middle',
        nameGap: 26,
        axisLine: { lineStyle: { color: GRID } },
        axisLabel: { color: '#78716c' },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#78716c',
          formatter: (v: number) =>
            Math.abs(v) >= 1e8
              ? `${(v / 1e8).toFixed(0)}亿`
              : Math.abs(v) >= 1e4
                ? `${(v / 1e4).toFixed(0)}万`
                : `${v}`,
        },
        splitLine: { lineStyle: { color: GRID } },
      },
      series: [
        {
          name: '可投资资产',
          type: 'line',
          data: assets,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: INK, width: 2 },
          areaStyle: { color: 'rgba(51,65,85,0.06)' },
          markLine: {
            silent: true,
            symbol: 'none',
            data: [
              {
                yAxis: Math.round(requiredCapital),
                lineStyle: { color: ACCENT, type: 'dashed', width: 1.5 },
                label: {
                  formatter: '目标本金',
                  color: ACCENT,
                  position: 'insideEndTop',
                  fontSize: 11,
                },
              },
              {
                xAxis: String(plan.targetAge),
                lineStyle: { color: '#a8a29e', type: 'dotted', width: 1 },
                label: {
                  formatter: `目标 ${plan.targetAge} 岁`,
                  color: '#78716c',
                  position: 'end',
                  fontSize: 11,
                },
              },
            ],
          },
        },
        {
          name: '人生目标',
          type: 'scatter',
          data: goalPoints,
          symbolSize: 10,
          itemStyle: { color: ACCENT, opacity: 0.85 },
          label: {
            show: true,
            position: 'top',
            formatter: (p: { data: { name: string } }) => p.data.name,
            color: ACCENT,
            fontSize: 11,
          },
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, comparison, lifeStyle, requiredCapital]);

  return (
    <div className="w-full">
      <ReactECharts option={option} style={{ height: 360, width: '100%' }} notMerge />
    </div>
  );
}
