/**
 * 问卷选项字典（展示文案），值与 financial-freedom/types.ts 保持一致。
 */
import type { OptionItem } from './fields';
import type {
  PreferredWorkStyle,
  FreedomDefinition,
  HouseholdType,
  ContributionGrowth,
} from '@/financial-freedom/types';

export const LIFE_PRIORITY_OPTIONS: OptionItem<string>[] = [
  { value: 'freedom', label: '时间自由', desc: '能自主安排每一天' },
  { value: 'health', label: '健康与活力', desc: '身体好、有精力' },
  { value: 'family', label: '陪伴家人', desc: '花时间在重要的人身上' },
  { value: 'growth', label: '成长与体验', desc: '持续学习、见世面' },
  { value: 'travel', label: '旅行与探索', desc: '去想去的地方' },
  { value: 'security', label: '安稳保障', desc: '不焦虑、有兜底' },
  { value: 'legacy', label: '留下点什么', desc: '创造作品 / 帮助他人' },
  { value: 'comfort', label: '舒适生活', desc: '住得好、吃得好' },
];

export const PREFERRED_WORK_OPTIONS: OptionItem<PreferredWorkStyle>[] = [
  { value: 'continue-working', label: '继续现在的工作', desc: '只是想更有底气' },
  { value: 'reduce-hours', label: '减少工时 / 半退休', desc: '保留部分收入与意义' },
  { value: 'switch-career', label: '换个更想做的方向', desc: '收入可能下降' },
  { value: 'own-business', label: '做自己的事', desc: '创业 / 自由职业' },
  { value: 'stop-working', label: '彻底停止工作', desc: '不再为钱工作' },
  { value: 'unknown', label: '还没想清楚', desc: '先算个数再说' },
];

export const FREEDOM_DEF_OPTIONS: OptionItem<FreedomDefinition>[] = [
  { value: 'time-freedom', label: '时间自由', desc: '做什么、什么时候做，自己说了算' },
  { value: 'passive-income-covers-spending', label: '被动收入覆盖开销', desc: '睡后收入 ≥ 日常支出' },
  { value: 'optional-work', label: '工作变成可选项', desc: '不为生存而工作' },
  { value: 'never-work-again', label: '再也不用为钱工作', desc: '完全的财务独立' },
  { value: 'unknown', label: '说不清', desc: '先看数字' },
];

export const HOUSEHOLD_OPTIONS: OptionItem<HouseholdType>[] = [
  { value: 'single', label: '单身' },
  { value: 'couple-no-kids', label: '二人世界（无孩）' },
  { value: 'couple-with-kids', label: '夫妻 + 孩子' },
  { value: 'single-parent', label: '单亲家庭' },
  { value: 'extended', label: '与长辈同住 / 大家庭' },
  { value: 'unknown', label: '暂不透露' },
];

export const CONTRIBUTION_GROWTH_OPTIONS: OptionItem<ContributionGrowth>[] = [
  { value: 'inflation', label: '随通胀同步增长', desc: '最常用的中性假设' },
  { value: 'fixed', label: '金额固定不变', desc: '按今天的金额一直投入' },
  { value: 'custom', label: '自定义增长率', desc: '输入预期的年增长' },
];

export const CURRENCY_OPTIONS: { value: 'CNY' | 'USD' | 'HKD' | 'TWD' | 'SGD' | 'MYR' | 'EUR' | 'GBP'; label: string }[] = [
  { value: 'CNY', label: '人民币 (¥)' },
  { value: 'USD', label: '美元 ($)' },
  { value: 'HKD', label: '港币 (HK$)' },
  { value: 'TWD', label: '新台币 (NT$)' },
  { value: 'SGD', label: '新加坡元 (S$)' },
  { value: 'MYR', label: '马来西亚林吉特 (RM)' },
  { value: 'EUR', label: '欧元 (€)' },
  { value: 'GBP', label: '英镑 (£)' },
];

export const GOAL_TYPE_OPTIONS = [
  { value: 'oneTime', label: '一次性' },
  { value: 'yearly', label: '每年都要' },
  { value: 'monthly', label: '每月都要' },
  { value: 'years', label: '持续若干年' },
] as const;

export const GOAL_FUNDING_OPTIONS = [
  { value: 'freedomAssets', label: '由自由期资产支付' },
  { value: 'currentAssets', label: '由当前资产 / 积累期支付' },
  { value: 'futureIncome', label: '由未来工资支付' },
  { value: 'ready', label: '已备好钱，不影响模拟' },
  { value: 'unknown', label: '不确定（按自由资产算）' },
] as const;

export const GOAL_IMPORTANCE_OPTIONS = [
  { value: 'must', label: '必须有' },
  { value: 'want', label: '很想要' },
  { value: 'nice', label: '有更好' },
  { value: 'unsure', label: '不确定' },
] as const;

/** 优先级 key → 中文标签（报告用） */
export const PRIORITY_LABELS: Record<string, string> = Object.fromEntries(
  LIFE_PRIORITY_OPTIONS.map((o) => [o.value, o.label]),
);
