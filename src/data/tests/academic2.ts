// 新增学术类题库：霍兰德RIASEC、希波克拉底四气质、罗森伯格自尊SES、焦虑SAS、抑郁SDS
// EXPORTS: RIASEC_TEST, TEMPERAMENT_TEST, SES_TEST, SAS_TEST, SDS_TEST
import type { ITestDef, ITypePoint, TypeMeta, DimensionMeta, IOption } from '@/data/types';
import { sumW, buildDimensionPoints } from '@/lib/scoring';

const LIKERT5 = [
  { text: '非常不同意', w: { _: -2 } },
  { text: '不太同意', w: { _: -1 } },
  { text: '中立', w: { _: 0 } },
  { text: '比较同意', w: { _: 1 } },
  { text: '非常同意', w: { _: 2 } },
];
const p = (key: string, reverse = false): IOption[] =>
  LIKERT5.map((o) => ({ text: o.text, w: { [key]: reverse ? -(o.w._) : o.w._ } }));

const DISCLAIMER =
  '本测试仅为自我参考的简化版本，学术上存在争议或已做简化改编，不能替代专业评估，请勿作为职业、婚恋、升学等重大决策的唯一依据。';
const PSY_DISCLAIMER =
  '本自评仅用于自我了解与参考，不能替代精神科医生、心理咨询师的专业诊断。如果自评得分偏高或长期影响生活，请务必寻求专业帮助。';

/* ================= 霍兰德职业兴趣 RIASEC ================= */
const RIASEC_META: Record<string, TypeMeta> = {
  R: {
    name: 'R 实际型', desc: '喜欢动手操作、务实具体的工作，享受看得见的成果；偏好工具、机械、户外与动手任务。',
    adv: '动手能力强，务实可靠，执行力足', risk: '对抽象、纯沟通类工作容易缺乏耐心',
    match: '给足实际任务与清晰步骤，少空谈概念', pit: '选纯文书/纯社交岗会觉得枯燥、坐不住', tip: '在动手之外适度补充沟通与表达练习',
  },
  I: {
    name: 'I 研究型', desc: '喜欢钻研问题、分析数据、探索原理，享受独立思考和解决难题的过程。',
    adv: '逻辑严谨，善于分析与钻研', risk: '偏内向专注，容易忽略人际与现实落地',
    match: '给独立钻研时间，用逻辑对话', pit: '长期脱离人群，沟通能力被低估', tip: '主动把研究结果讲给别人听',
  },
  A: {
    name: 'A 艺术型', desc: '追求创造、美感与自我表达，喜欢不设限、能发挥想象力的工作。',
    adv: '创造力强，审美敏锐，表达独特', risk: '抗拒规则束缚，容易理想化、情绪化',
    match: '给创作自由与试错空间', pit: '难以忍受机械重复的事务', tip: '给创意配上时间表，养成持续产出',
  },
  S: {
    name: 'S 社会型', desc: '乐于帮助、教导、服务他人，重视人际互动与意义感，擅长沟通共情。',
    adv: '共情力强，善于沟通，热心助人', risk: '容易过度付出、忽略自身边界',
    match: '多给情感反馈与协作机会', pit: '承担过多他人情绪，精力透支', tip: '建立边界，先照顾好自己的能量',
  },
  E: {
    name: 'E 企业型', desc: '喜欢领导、说服、竞争与达成目标，追求影响力、成就与掌控。',
    adv: '目标感强，敢拍板，善于推动', risk: '容易强势、急于求成，忽略细节',
    match: '给决策权与挑战性目标', pit: '只顾结果忽视团队感受', tip: '结果之外多倾听，兼顾团队节奏',
  },
  C: {
    name: 'C 常规型', desc: '喜欢秩序、规则与准确，擅长数据整理、流程管理与精细化工作，注重可靠。',
    adv: '严谨细致，可靠守信，条理清晰', risk: '偏好稳定，抗拒太大变动与创新',
    match: '给明确规则与稳定节奏', pit: '面对混沌无序的环境容易焦虑', tip: '在稳定中主动尝试少量新方法',
  },
};

export const RIASEC_TEST: ITestDef = {
  id: 'riasec',
  name: '霍兰德职业兴趣 RIASEC',
  category: 'academic',
  desc: '基于霍兰德六角模型的职业兴趣测试，帮你找到更匹配的工作类型：实际型 R、研究型 I、艺术型 A、社会型 S、企业型 E、常规型 C。',
  time: '8-12 分钟',
  trust: '学术量表 · 具备实证基础（简化版）',
  icon: 'Briefcase',
  module: 'RIASEC',
  kind: 'topType',
  questions: [
    { q: '我喜欢亲手制作、修理或组装东西', opts: p('R') },
    { q: '户外或需要动手操作的工作让我更有干劲', opts: p('R') },
    { q: '比起讨论，我更享受把一件事直接做出来', opts: p('R') },
    { q: '我享受钻研数据、把问题想透', opts: p('I') },
    { q: '面对难题，我习惯独立思考解决', opts: p('I') },
    { q: '研究原理、探索「为什么」让我着迷', opts: p('I') },
    { q: '创作、设计或表达美感让我感到充实', opts: p('A') },
    { q: '我重视自由发挥，讨厌被规则死死框住', opts: p('A') },
    { q: '我常有别人想不到的点子或视角', opts: p('A') },
    { q: '帮助别人解决问题能给我很大满足感', opts: p('S') },
    { q: '我喜欢与人打交道、建立信任关系', opts: p('S') },
    { q: '教育、引导或照顾他人是我擅长的', opts: p('S') },
    { q: '我享受说服别人、推动事情往前', opts: p('E') },
    { q: '我喜欢有挑战、能竞争、能当主角的工作', opts: p('E') },
    { q: '达成目标、获得成就会让我很兴奋', opts: p('E') },
    { q: '我做事讲究流程与规范，喜欢井井有条', opts: p('C') },
    { q: '整理数据、核对细节我有耐心也很擅长', opts: p('C') },
    { q: '稳定、可预期的环境和规则让我安心', opts: p('C') },
  ],
  typesMeta: RIASEC_META,
  compute(answers) {
    const types: ITypePoint[] = Object.keys(RIASEC_META).map((k) => ({
      key: k, name: RIASEC_META[k].name, score: sumW(answers, k),
    }));
    const sorted = [...types].sort((a, b) => b.score - a.score);
    const primary = sorted[0];
    return {
      kind: 'topType',
      summary: `你最匹配的职业兴趣类型是「${primary.name}」。兴趣会随着经历变化，你的次高兴趣也很重要——霍兰德建议把相邻类型组合起来看，往往更贴近真实偏好。`,
      types: sorted,
      primaryKey: primary.key,
      primaryName: primary.name,
      tags: ['霍兰德', '职业兴趣', '学术量表'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= 希波克拉底四气质 ================= */
const TEMPERAMENT_META: Record<string, TypeMeta> = {
  sanguine: {
    name: '多血质（S）', desc: '活泼开朗，反应快，情绪外露且转换快，社交能力强，兴趣广泛但易转移。',
    adv: '热情外向，感染力强，反应敏捷', risk: '兴趣多变，容易三分钟热度',
    match: '多给新鲜互动与即时反馈', pit: '浅尝辄止、难以深入长期项目', tip: '为兴趣排优先级，坚持至少一个长期目标',
  },
  choleric: {
    name: '胆汁质（C）', desc: '精力旺盛，果敢冲动，目标明确，直来直去，行动快、韧性强但易急躁。',
    adv: '行动力强，有冲劲，敢于担当', risk: '急躁冲动，说话直接易冲突',
    match: '直接高效沟通，给足行动空间', pit: '情绪上头时口不择言，破坏关系', tip: '重要决策前先停顿几秒，压下冲动',
  },
  phlegmatic: {
    name: '黏液质（P）', desc: '沉稳安静，从容耐心，情绪平稳，克制而坚持，但反应偏慢、略显保守。',
    adv: '冷静耐心，稳定可靠，抗压好', risk: '反应慢，偏保守，不善即时表达',
    match: '给足思考时间，别催促表态', pit: '过于隐忍、错失表达时机', tip: '主动在重要场合提前准备表达',
  },
  melancholic: {
    name: '抑郁质（M）', desc: '心思细腻，敏感深刻，感受力强，做事认真追求质量，但容易多虑内耗。',
    adv: '细腻深刻，认真负责，洞察力强', risk: '敏感多虑，容易自我怀疑内耗',
    match: '多肯定与耐心，避免粗线条刺激', pit: '过度追求完美、反复纠结细节', tip: '区分事实与脑补，练习自我肯定',
  },
};

export const TEMPERAMENT_TEST: ITestDef = {
  id: 'temperament',
  name: '希波克拉底四气质',
  category: 'academic',
  desc: '古老的体液气质理论，把人分为多血质、胆汁质、黏液质、抑郁质四种典型气质，帮你了解先天的情绪与行为倾向。',
  time: '7-10 分钟',
  trust: '经典理论 · 偏经验学说，仅供参考',
  icon: 'Droplets',
  module: 'TEMPERAMENT',
  kind: 'topType',
  questions: [
    { q: '我通常精力充沛，喜欢活跃热闹的环境', opts: p('sanguine') },
    { q: '我情绪来得快去得也快，很少长时间低落', opts: p('sanguine') },
    { q: '我兴趣广泛，常同时喜欢很多新鲜事物', opts: p('sanguine') },
    { q: '我做事雷厉风行，想好了就立刻冲', opts: p('choleric') },
    { q: '我目标感很强，认准的事很难被劝退', opts: p('choleric') },
    { q: '遇到冲突我倾向直接摊开讲，不喜欢憋着', opts: p('choleric') },
    { q: '我情绪平稳，很少有大的起落', opts: p('phlegmatic') },
    { q: '我做事有耐心，能长期坚持不轻易放弃', opts: p('phlegmatic') },
    { q: '面对突发情况，我通常比周围人更镇定', opts: p('phlegmatic') },
    { q: '我心思细腻，能察觉别人忽略的细节', opts: p('melancholic') },
    { q: '我对小事也会想得很深，容易放在心上', opts: p('melancholic') },
    { q: '我做事认真，追求高质量，不喜欢将就', opts: p('melancholic') },
    { q: '我容易很快和陌生人打成一片', opts: p('sanguine') },
    { q: '我说话做事都比较直接、有冲劲', opts: p('choleric') },
    { q: '我很少被外界干扰，能保持自己的节奏', opts: p('phlegmatic') },
    { q: '我敏感易感，别人的一句话会让我想很久', opts: p('melancholic') },
  ],
  typesMeta: TEMPERAMENT_META,
  compute(answers) {
    const types: ITypePoint[] = Object.keys(TEMPERAMENT_META).map((k) => ({
      key: k, name: TEMPERAMENT_META[k].name, score: sumW(answers, k),
    }));
    const sorted = [...types].sort((a, b) => b.score - a.score);
    const primary = sorted[0];
    return {
      kind: 'topType',
      summary: `你的主导气质偏向「${primary.name}」。现实中多数人是混合气质，你的次高气质同样在塑造你，请结合两者看待。`,
      types: sorted,
      primaryKey: primary.key,
      primaryName: primary.name,
      tags: ['四气质', '经典理论'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= 罗森伯格自尊量表 SES ================= */
const SES_META: DimensionMeta[] = [
  {
    key: 'esteem', label: '自尊水平',
    low: '自我评价偏低，常怀疑自己的价值', high: '自我接纳度高，对自己有稳定信心', mid: '自尊水平适中，自我评价有起伏',
    advLow: '谦逊，能反思不足，渴望成长', riskLow: '容易自我否定，在意他人评价，抗挫弱',
    matchLow: '多给予真诚肯定，避免批评打击', pitLow: '被否定时容易彻底否定自己', tipLow: '每天记录一件自己做成的、值得肯定的小事',
    advHigh: '自信笃定，敢于表达主张', riskHigh: '偶尔过度自信，忽略真实反馈',
    matchHigh: '可直接提意见，尊重其主张', pitHigh: '听不进不同声音，阻碍成长', tipHigh: '主动寻求并吸收他人反馈',
    advMid: '自我认知较平衡，能接受优缺点', riskMid: '自我评价随情境波动，不够稳定',
    matchMid: '正常沟通，适度肯定即可', pitMid: '在压力或比较中自我怀疑', tipMid: '建立稳定的自我价值判断，不随外界摆动',
  },
];

export const SES_TEST: ITestDef = {
  id: 'ses',
  name: '罗森伯格自尊量表 (SES)',
  category: 'academic',
  desc: '经典自尊评估量表，测量你对自己总体价值的看法，了解自我接纳与自我肯定的程度。',
  time: '4-6 分钟',
  trust: '学术量表 · 具备实证基础（改编版）',
  icon: 'ShieldCheck',
  module: 'SES',
  kind: 'dimension',
  questions: [
    { q: '总的来说，我对自己是满意的', opts: p('esteem') },
    { q: '我经常觉得自己没什么可自豪的', opts: p('esteem', true) },
    { q: '我觉得自己有不少优点', opts: p('esteem') },
    { q: '我倾向于认为自己是个失败者', opts: p('esteem', true) },
    { q: '我觉得自己是能像大多数人一样把事情做好的', opts: p('esteem') },
    { q: '我常觉得自己不如别人', opts: p('esteem', true) },
    { q: '整体上我对自己是肯定的', opts: p('esteem') },
    { q: '我有时希望自己能更看得起自己', opts: p('esteem', true) },
    { q: '我能够承担起生活中应尽的责任', opts: p('esteem') },
    { q: '我常感到自己一无是处', opts: p('esteem', true) },
  ],
  dimensionMeta: SES_META,
  compute(answers) {
    const dims = buildDimensionPoints([
      { key: 'esteem', label: '自尊水平', raw: sumW(answers, 'esteem'), min: -8, max: 8 },
    ]);
    const d = dims[0];
    const map = { low: '偏低', mid: '适中', high: '较高' } as const;
    return {
      kind: 'dimension',
      summary: `你的自尊水平为「${map[d.level]}」（${d.percent}%）。自尊反映的是你如何看待自身价值，它与自信相关但不等同，且可以通过自我接纳与成长逐步提升。`,
      dimensions: dims,
      primaryKey: d.key,
      primaryName: d.label,
      tags: ['自尊', '学术量表'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= 焦虑自评 SAS（简化） ================= */
const SAS_META: DimensionMeta[] = [
  {
    key: 'anxiety', label: '焦虑水平',
    low: '焦虑感低，心态相对放松安稳', high: '焦虑感较明显，情绪容易紧绷', mid: '有适度焦虑，多数时候能调节',
    advLow: '心态松弛，睡眠与情绪较稳定', riskLow: '对风险与压力信号不够敏感',
    matchLow: '直接客观沟通即可', pitLow: '过度放松，忽略真实隐患', tipLow: '保持适度忧患意识与计划',
    advHigh: '对压力敏感，能提前察觉风险', riskHigh: '容易精神紧绷、胡思乱想、睡不好',
    matchHigh: '多给确定感与安抚，减少刺激', pitHigh: '小事被反复放大成焦虑', tipHigh: '规律作息，练习深呼吸与正念，必要时求助',
    advMid: '对压力有正常反应，能自我调节', riskMid: '压力大时容易阶段性焦虑', pitMid: '忙乱时情绪被带偏', tipMid: '压力大时主动安排放松与倾诉',
  },
];

export const SAS_TEST: ITestDef = {
  id: 'sas',
  name: '焦虑自评量表 (SAS)',
  category: 'academic',
  desc: '经典焦虑自评量表的简化版，评估你近期的紧张、担忧与不安程度，帮助你觉察情绪状态。',
  time: '5-8 分钟',
  trust: '学术量表 · 简化改编，仅供自评参考',
  icon: 'Wind',
  module: 'SAS',
  kind: 'dimension',
  questions: [
    { q: '最近我常常感到紧张和难以放松', opts: p('anxiety') },
    { q: '我最近总是担心会有不好的事情发生', opts: p('anxiety') },
    { q: '入睡前我常反复想事情，脑子停不下来', opts: p('anxiety') },
    { q: '我容易因为小事而心烦意乱', opts: p('anxiety') },
    { q: '最近我的心跳偶尔会莫名加快', opts: p('anxiety') },
    { q: '我总有一种坐立不安的感觉', opts: p('anxiety') },
    { q: '我最近很难专心做一件事', opts: p('anxiety') },
    { q: '担心过度让我有些疲惫', opts: p('anxiety') },
    { q: '最近我的睡眠质量还不错，比较安稳', opts: p('anxiety', true) },
    { q: '遇到事情时，我大多能保持从容', opts: p('anxiety', true) },
    { q: '我最近的胃口和身体状态都正常', opts: p('anxiety', true) },
    { q: '总体上我最近心情比较平和', opts: p('anxiety', true) },
  ],
  dimensionMeta: SAS_META,
  compute(answers) {
    const dims = buildDimensionPoints([
      { key: 'anxiety', label: '焦虑水平', raw: sumW(answers, 'anxiety'), min: -10, max: 10 },
    ]);
    const d = dims[0];
    const map = { low: '较低', mid: '中等', high: '偏高' } as const;
    return {
      kind: 'dimension',
      summary: `你近期的焦虑倾向为「${map[d.level]}」（${d.percent}%）。焦虑是常见情绪，适度焦虑有提醒作用；若长期偏高并影响生活，建议寻求专业帮助。`,
      dimensions: dims,
      primaryKey: d.key,
      primaryName: d.label,
      tags: ['焦虑', '情绪自评'],
      disclaimer: PSY_DISCLAIMER,
    };
  },
};

/* ================= 抑郁自评 SDS（简化） ================= */
const SDS_META: DimensionMeta[] = [
  {
    key: 'depression', label: '情绪低落程度',
    low: '情绪整体积极，少有持续低落', high: '情绪低落感明显，需要关注', mid: '偶有低落，多数时候能恢复',
    advLow: '情绪积极，动力与活力充沛', riskLow: '可能忽略负面情绪的提醒作用',
    matchLow: '正常沟通即可', pitLow: '把负面情绪完全压抑', tipLow: '允许自己有正常情绪起伏',
    advHigh: '感受细腻，能觉察内心需求', riskHigh: '容易陷入低落、疲惫、缺乏动力',
    matchHigh: '多陪伴倾听，减少指责说教', pitHigh: '自我封闭，情况加重也不求助', tipHigh: '规律作息运动，多和信任的人聊聊，必要时就医',
    advMid: '情绪有起伏但能自我恢复', riskMid: '压力大时容易消沉', pitMid: '低落时回避社交与运动', tipMid: '低落时主动做能让自己愉悦的小事',
  },
];

export const SDS_TEST: ITestDef = {
  id: 'sds',
  name: '抑郁自评量表 (SDS)',
  category: 'academic',
  desc: '经典抑郁自评量表的简化版，评估你近期的情绪低落、兴趣与活力状态，帮助你自我觉察。',
  time: '5-8 分钟',
  trust: '学术量表 · 简化改编，仅供自评参考',
  icon: 'CloudRain',
  module: 'SDS',
  kind: 'dimension',
  questions: [
    { q: '最近我觉得做什么都提不起劲', opts: p('depression') },
    { q: '我最近情绪明显低落、想哭', opts: p('depression') },
    { q: '我对以前喜欢的事情兴趣下降了', opts: p('depression') },
    { q: '最近我常觉得自己毫无价值', opts: p('depression') },
    { q: '最近我入睡困难或早醒', opts: p('depression') },
    { q: '我最近感到疲惫，精力大不如前', opts: p('depression') },
    { q: '最近我不太想见人，想一个人待着', opts: p('depression') },
    { q: '我最近难以集中注意力', opts: p('depression') },
    { q: '总体而言，我最近心情还不错', opts: p('depression', true) },
    { q: '我对未来仍抱有期待和希望', opts: p('depression', true) },
    { q: '最近我能从平时的事情里得到快乐', opts: p('depression', true) },
    { q: '我最近的生活节奏和精神状态都正常', opts: p('depression', true) },
  ],
  dimensionMeta: SDS_META,
  compute(answers) {
    const dims = buildDimensionPoints([
      { key: 'depression', label: '情绪低落程度', raw: sumW(answers, 'depression'), min: -10, max: 10 },
    ]);
    const d = dims[0];
    const map = { low: '较低', mid: '中等', high: '偏高' } as const;
    return {
      kind: 'dimension',
      summary: `你近期的情绪低落倾向为「${map[d.level]}」（${d.percent}%）。情绪低落是常见的心理信号，本结果仅供自我参考；如果持续两周以上且影响生活，请务必寻求专业帮助。`,
      dimensions: dims,
      primaryKey: d.key,
      primaryName: d.label,
      tags: ['抑郁', '情绪自评'],
      disclaimer: PSY_DISCLAIMER,
    };
  },
};
