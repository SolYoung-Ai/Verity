// 趣味娱乐测试题库：乐嘉色彩性格、动物性格
// EXPORTS: COLOR_TEST, ANIMAL_TEST
import type { ITestDef, ITypePoint, TypeMeta, IOption } from '@/data/types';
import { sumW } from '@/lib/scoring';

const DISCLAIMER =
  '本测试纯属娱乐，无严谨心理学效度，存在巴纳姆效应（描述看似精准实则泛用），仅供玩乐，请勿当真，也不能作为任何决策依据。';

const LIKERT5 = [
  { text: '完全不是我', w: { _: -2 } },
  { text: '不太像我', w: { _: -1 } },
  { text: '一般', w: { _: 0 } },
  { text: '比较像我', w: { _: 1 } },
  { text: '完全就是我', w: { _: 2 } },
];
const p = (key: string): IOption[] =>
  LIKERT5.map((o) => ({ text: o.text, w: { [key]: o.w._ } }));

/* ================= 乐嘉色彩性格 ================= */
const COLOR_META: Record<string, TypeMeta> = {
  red: {
    name: '红色 · 行动热情型', desc: '活力充沛，直接果断，喜欢掌控节奏、追求效率，情绪外露、敢想敢做。',
    adv: '果断热情，行动力强，有感染力', risk: '容易冲动急躁，忽略细节与他人的感受',
    match: '沟通直接爽快，尊重其节奏', pit: '冲动决策、说话太冲，容易伤人', tip: '重要决定先缓三秒，多倾听再表态',
  },
  blue: {
    name: '蓝色 · 理性完美型', desc: '严谨自律，重视规则与条理，追求把事情做到尽善尽美，理性而内敛。',
    adv: '严谨靠谱，条理清晰，追求高品质', risk: '容易苛求完美，挑剔自己和别人',
    match: '讲逻辑、重数据，尊重其秩序感', pit: '过度较真、钻细节，让气氛紧张', tip: '学会接受「完成大于完美」，适当放松',
  },
  yellow: {
    name: '黄色 · 乐观社交型', desc: '乐观开朗，热爱表达与结交朋友，点子多、感染力强，享受被关注。',
    adv: '乐观活跃，善于带动氛围、表达自我', risk: '易三分钟热度，忽略落地与细节',
    match: '多给表达空间与正向反馈', pit: '承诺多、兑现少，显得不靠谱', tip: '热情之后列个执行清单，说到做到',
  },
  green: {
    name: '绿色 · 平和和谐型', desc: '温和稳重，重视和谐与稳定，善于体谅他人，讨厌冲突，给人安全感。',
    adv: '平和可靠，随和包容，让人安心', risk: '回避冲突、过于被动，压抑需求',
    match: '温和沟通，给足缓冲与安全感', pit: '一味迎合，自己的想法被淹没', tip: '在关键处练习表达真实立场',
  },
};

export const COLOR_TEST: ITestDef = {
  id: 'color',
  name: '乐嘉色彩性格测试',
  category: 'fun',
  desc: '用红蓝黄绿四种颜色类比你的性格底色，轻松认识自己的行为偏好。纯娱乐，别太当真。',
  time: '4-6 分钟',
  trust: '娱乐测试 · 无心理学效度',
  icon: 'Palette',
  module: 'COLOR',
  kind: 'topType',
  questions: [
    { q: '遇到问题我习惯立刻行动、直来直去', opts: p('red') },
    { q: '我喜欢按计划推进，讨厌失控和乱糟糟', opts: p('blue') },
    { q: '我天生乐观，喜欢热闹、爱表达', opts: p('yellow') },
    { q: '我追求和谐，最怕和人起冲突', opts: p('green') },
    { q: '我说话做事都很干脆，不喜欢拖泥带水', opts: p('red') },
    { q: '我对细节和质量有很高的要求', opts: p('blue') },
    { q: '朋友都说我幽默开朗、很能聊', opts: p('yellow') },
    { q: '我习惯先照顾别人的感受，自己放最后', opts: p('green') },
    { q: '我享受快节奏和挑战，闲不下来', opts: p('red') },
    { q: '做重要事前，我要先把计划和利弊想清楚', opts: p('blue') },
    { q: '我喜欢成为人群里活跃的那个人', opts: p('yellow') },
    { q: '我宁愿退一步，也不愿把事情闹僵', opts: p('green') },
  ],
  typesMeta: COLOR_META,
  compute(answers) {
    const types: ITypePoint[] = Object.keys(COLOR_META).map((k) => ({
      key: k, name: COLOR_META[k].name, score: sumW(answers, k),
    }));
    const sorted = [...types].sort((a, b) => b.score - a.score);
    const primary = sorted[0];
    return {
      kind: 'topType',
      summary: `你的主色彩是「${primary.name}」。注意色彩测试是娱乐工具，描述宽泛而人人适用（巴纳姆效应），图个乐就好。`,
      types: sorted,
      primaryKey: primary.key,
      primaryName: primary.name,
      tags: ['色彩性格', '娱乐测试'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= 动物性格 ================= */
const ANIMAL_META: Record<string, TypeMeta> = {
  tiger: {
    name: '老虎 · 果敢目标型', desc: '目标感强，果断强势，追求结果与掌控，是天生的行动派和领导者。',
    adv: '目标明确，决策果断，领导力强', risk: '强势独断，忽略他人感受',
    match: '直接沟通，尊重其主导地位', pit: '强势命令式沟通，让人压抑', tip: '多倾听他人，适当放慢节奏',
  },
  peacock: {
    name: '孔雀 · 表现社交型', desc: '自信开朗，热爱表现与社交，感染力强，喜欢成为焦点。',
    adv: '自信外向，表达力强，能带动氛围', risk: '爱表现，忽略他人与细节',
    match: '多给舞台与认可', pit: '抢风头、夸夸其谈，招人反感', tip: '表现之外也多倾听与落地',
  },
  koala: {
    name: '考拉 · 温和稳健型', desc: '平和耐心，温柔包容，重视和谐与稳定，让人感到踏实可靠。',
    adv: '温柔可靠，包容耐心，团队粘合剂', risk: '过于被动，回避冲突与改变',
    match: '温和沟通，给足安全感与缓冲', pit: '一味顺从、不敢提意见', tip: '关键时勇敢表达自己的立场',
  },
  owl: {
    name: '猫头鹰 · 严谨分析型', desc: '严谨细致，重视数据与逻辑，善于分析，追求精准与正确。',
    adv: '严谨精准，逻辑清晰，考虑周全', risk: '苛求完美，钻牛角尖',
    match: '讲数据、讲依据，尊重其严谨', pit: '过度较真、挑毛病，气氛紧张', tip: '学会抓大放小，别陷进细节',
  },
};

export const ANIMAL_TEST: ITestDef = {
  id: 'animal',
  name: '动物性格测试',
  category: 'fun',
  desc: '用老虎、孔雀、考拉、猫头鹰四种动物类比你的行为风格，轻松有趣地了解自己。纯娱乐。',
  time: '4-6 分钟',
  trust: '娱乐测试 · 无心理学效度',
  icon: 'PawPrint',
  module: 'ANIMAL',
  kind: 'topType',
  questions: [
    { q: '我目标感强，做事讲求结果和效率', opts: p('tiger') },
    { q: '我自信开朗，喜欢表达和成为焦点', opts: p('peacock') },
    { q: '我温和有耐心，凡事求稳、不喜欢争', opts: p('koala') },
    { q: '我做事严谨，重视细节和逻辑', opts: p('owl') },
    { q: '遇到分歧，我倾向直接说出自己的决定', opts: p('tiger') },
    { q: '朋友常说我幽默、很能带动气氛', opts: p('peacock') },
    { q: '我习惯先考虑大家的感受，自己放后面', opts: p('koala') },
    { q: '做决定前，我要把利弊和数据想得很清楚', opts: p('owl') },
  ],
  typesMeta: ANIMAL_META,
  compute(answers) {
    const types: ITypePoint[] = Object.keys(ANIMAL_META).map((k) => ({
      key: k, name: ANIMAL_META[k].name, score: sumW(answers, k),
    }));
    const sorted = [...types].sort((a, b) => b.score - a.score);
    const primary = sorted[0];
    return {
      kind: 'topType',
      summary: `你的动物人格是「${primary.name}」。动物测试同样是娱乐向，图个乐，不必当真。`,
      types: sorted,
      primaryKey: primary.key,
      primaryName: primary.name,
      tags: ['动物性格', '娱乐测试'],
      disclaimer: DISCLAIMER,
    };
  },
};
