/**
 * 报告文案字典：把 report-engine 推导的 key 映射成中文句子。
 * 数字全部来自计算引擎，这里只放定性文案。
 */
import { PRIORITY_LABELS } from './options';

export const NEXT_ACTION_COPY: Record<string, { title: string; body: string }> = {
  'action.on-track-keep-savings': {
    title: '你已经在轨道上',
    body: '按当前投入节奏，基准情景下有望在目标年龄前后达成。保持现有储蓄率，别轻易动本金。',
  },
  'action.raise-savings-rate': {
    title: '先把储蓄率提上去',
    body: '距离目标还有较长年头，最有效的杠杆是每月多存一点。把加薪的一半以上转成定投，比追求高收益更可控。',
  },
  'action.design-partial-work': {
    title: '设计一份「半工作」',
    body: '你倾向减少工时或换方向，那就不必追求彻底躺平。算一份半退休预算，让你既能保留收入又拿到时间。',
  },
  'action.trim-budget': {
    title: '从预算里找空间',
    body: '你的自由更多是时间自由。把舒适预算再抠掉一项非必要开销，需要的本金会明显下降，自由来得更早。',
  },
  'action.grow-passive-income': {
    title: '把被动收入做大',
    body: '你看重被动收入覆盖开销。优先培育能产生现金流的资产或副业，哪怕金额不大，也会直接拉低目标本金。',
  },
  'action.optimize-withdrawal-plan': {
    title: '规划好提款节奏',
    body: '你想彻底不工作。重点不是攒更多，而是规划好每年从账户里拿多少、什么时候拿，顺序错了会大幅缩短账户寿命。',
  },
  'action.stay-the-course': {
    title: '按既定计划走',
    body: '数字介于中间，没有明显短板。每年回看一次这份计划，根据真实情况微调即可。',
  },
};

export const WORK_STYLE_LABELS: Record<string, string> = {
  'continue-working': '继续现在的工作',
  'reduce-hours': '减少工时 / 半退休',
  'switch-career': '换个更想做的方向',
  'own-business': '做自己的事',
  'stop-working': '彻底停止工作',
  unknown: '还没想清楚',
};

export const FREEDOM_DEF_LABELS: Record<string, string> = {
  'time-freedom': '时间自由',
  'passive-income-covers-spending': '被动收入覆盖开销',
  'optional-work': '工作变成可选项',
  'never-work-again': '再也不为钱工作',
  unknown: '还在探索',
};

export function priorityLabel(key: string): string {
  return PRIORITY_LABELS[key] ?? key;
}
