// 学术专业量表题库：大五、16PF、HEXACO、EPQ、成人依恋、EQ
// EXPORTS: BIGFIVE_TEST, PF16_TEST, HEXACO_TEST, EPQ_TEST, ATTACHMENT_TEST, EQ_TEST
import type { ITestDef, DimensionMeta, IOption } from '@/data/types';
import { sumW, buildDimensionPoints, pctOf, levelOf } from '@/lib/scoring';

const LIKERT5 = [
  { text: '非常不同意', w: { _: -2 } },
  { text: '不太同意', w: { _: -1 } },
  { text: '中立', w: { _: 0 } },
  { text: '比较同意', w: { _: 1 } },
  { text: '非常同意', w: { _: 2 } },
];
// 每题按单一维度加权，题级 w 会在题目定义里覆写
const p = (key: string, reverse = false): IOption[] =>
  LIKERT5.map((o) => ({ text: o.text, w: { [key]: reverse ? -(o.w._) : o.w._ } }));

const DISCLAIMER =
  '本测试仅为性格倾向参考，不能替代心理咨询师、精神科医生的专业评估，请勿将结果作为婚恋、招聘、升学等重大决策的唯一依据。';

/* ================= 大五人格 OCEAN ================= */
const BIGFIVE_META: DimensionMeta[] = [
  {
    key: 'O', label: '开放性',
    low: '偏好务实、传统，更关注现实落地', high: '想象力丰富，乐于接纳新观念、艺术与多元视角', mid: '在新奇与现实之间保持平衡',
    advLow: '脚踏实地，看重现实经验', riskLow: '对陌生观念接受较慢',
    matchLow: '讲实际利弊与真实案例，少空谈抽象概念', pitLow: '抗拒变化，抵触新方案', tipLow: '刻意接触少量不同立场观点，拓展视野',
    advHigh: '喜欢探索新思路，对新鲜事物包容', riskHigh: '容易想法太多难以落地',
    matchHigh: '多聊脑洞与概念，给足想象空间', pitHigh: '计划发散，缺少执行闭环', tipHigh: '选定想法后设置明确的执行期限',
  },
  {
    key: 'C', label: '尽责性',
    low: '随性灵活，讨厌被计划束缚', high: '自律有条理，重视责任规划', mid: '有一定条理，但也保留灵活性',
    advLow: '灵活应变，不被条条框框限制', riskLow: '拖延，容易忽视责任细节',
    matchLow: '少用死板规则约束，保留弹性空间', pitLow: '任务堆积，临时手忙脚乱', tipLow: '建立简易待办清单，抓关键节点',
    advHigh: '自律靠谱，重视承诺与流程', riskHigh: '容易过度苛求完美',
    matchHigh: '明确截止时间，分工清晰', pitHigh: '细节内卷，精神内耗', tipHigh: '允许部分事情「完成大于完美」',
  },
  {
    key: 'E', label: '外向性',
    low: '靠独处恢复精力，偏好向内思考', high: '社交中获取能量，乐于对外互动', mid: '独处与社交都能充电',
    advLow: '深度感受自我，思考有沉淀', riskLow: '社交后消耗大，容易回避必要人际',
    matchLow: '给足独处时间，不强迫频繁社交', pitLow: '封闭自己，错过协作机会', tipLow: '适度参与低压力社交',
    advHigh: '乐于社交，擅长对外沟通', riskHigh: '需要大量外部刺激，容易忽略内心感受',
    matchHigh: '多面对面交流，主动互动', pitHigh: '不停社交导致疲惫', tipHigh: '安排独处充电时段',
  },
  {
    key: 'A', label: '宜人性',
    low: '更坚持个人立场，说话直接', high: '友善合作，追求和睦', mid: '既讲原则也照顾他人',
    advLow: '立场清晰，敢于提出反对意见', riskLow: '说话直接，可能无意伤害他人感受',
    matchLow: '就事论事，补充情感层面的体谅', pitLow: '冲突中容易激化矛盾', tipLow: '表达观点时先共情再讲事实',
    advHigh: '共情他人，追求关系和睦', riskHigh: '容易讨好，压抑自身诉求',
    matchHigh: '温和沟通，顾及情绪', pitHigh: '一味妥协牺牲自我利益', tipHigh: '练习设立边界，敢于拒绝',
  },
  {
    key: 'N', label: '情绪敏感性',
    low: '情绪稳定，心态平和', high: '情绪波动大，更容易焦虑', mid: '情绪相对平稳，偶有波动',
    advLow: '抗压能力较强，心态稳定', riskLow: '对风险信号不够敏感',
    matchLow: '直接客观沟通即可', pitLow: '忽视潜在隐患，盲目乐观', tipLow: '有意识评估风险，不要过度乐观',
    advHigh: '感受力敏锐，提前感知风险', riskHigh: '容易胡思乱想、精神内耗',
    matchHigh: '多给予确认与安全感', pitHigh: '小事反复回想焦虑', tipHigh: '区分事实和脑补，写下来梳理情绪',
  },
];

const BIGFIVE_QUESTIONS = [
  { q: '我乐于接触全新的想法与创意', opts: p('O') },
  { q: '我做事习惯有条理，重视计划与秩序', opts: p('C') },
  { q: '社交聚会会让我精力充沛', opts: p('E') },
  { q: '我愿意体谅别人感受，倾向合作而非对抗', opts: p('A') },
  { q: '我很容易焦虑、情绪起伏比较明显', opts: p('N') },
  { q: '我偏好传统、熟悉的方式，不喜欢太多变化', opts: p('O', true) },
  { q: '我经常拖延，到最后一刻才完成任务', opts: p('C', true) },
  { q: '长时间独处会让我觉得身心恢复', opts: p('E', true) },
  { q: '我习惯坚持自己的立场，不太让步', opts: p('A', true) },
  { q: '我心态稳定，很少被小事困扰', opts: p('N', true) },
];

export const BIGFIVE_TEST: ITestDef = {
  id: 'bigfive',
  name: '大五人格 OCEAN',
  category: 'academic',
  desc: '心理学公认的人格黄金模型，评估开放性、尽责性、外向性、宜人性、情绪敏感性五个连续维度。',
  time: '8-12 分钟',
  trust: '学术量表 · 具备实证基础',
  icon: 'Compass',
  module: 'BIG FIVE',
  kind: 'dimension',
  questions: BIGFIVE_QUESTIONS,
  dimensionMeta: BIGFIVE_META,
  compute(answers) {
    const map = { O: '开放性', C: '尽责性', E: '外向性', A: '宜人性', N: '情绪敏感性' } as const;
    const dims = buildDimensionPoints(
      (Object.keys(map) as Array<keyof typeof map>).map((k) => ({
        key: k, label: map[k], raw: sumW(answers, k), min: -4, max: 4,
      })),
    );
    const top = [...dims].sort((a, b) => b.percent - a.percent)[0];
    return {
      kind: 'dimension',
      summary: `你的大五画像中，最突出的维度是「${top.label}」（${top.percent}%）。大五人格没有好坏之分，只是描述你在五个维度上的倾向，帮助你更了解自己的行为习惯与情绪模式。`,
      dimensions: dims,
      primaryKey: top.key,
      primaryName: top.label,
      tags: ['大五人格', '学术量表'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= 卡特尔 16PF ================= */
const PF16_LABELS = [
  'A 乐群性', 'B 聪慧性', 'C 稳定性', 'E 恃强性', 'F 兴奋性', 'G 有恒性',
  'H 敢为性', 'I 敏感性', 'L 怀疑性', 'M 幻想性', 'N 世故性', 'O 忧虑性',
  'Q1 实验性', 'Q2 独立性', 'Q3 自律性', 'Q4 紧张性',
];

const PF16_META: DimensionMeta[] = [
  { key: 'A', label: 'A 乐群性', low: '喜欢独处，独立自主', high: '热情合群，乐于与人交往', mid: '人际需求适中',
    matchLow: '尊重独处需求，不必刻意拉近', pitLow: '被频繁应酬消耗，回避人群', tipLow: '主动维系少量核心关系',
    matchHigh: '多参与群体互动，热情回应', pitHigh: '过度依赖他人陪伴', tipHigh: '留出独立思考的时间' },
  { key: 'B', label: 'B 聪慧性', low: '偏重经验直觉，务实判断', high: '抽象推理强，善于学习', mid: '学习能力中等均衡',
    matchLow: '讲具体例子，避免纯理论', pitLow: '面对抽象理论容易受挫', tipLow: '把复杂问题拆成可操作步骤',
    matchHigh: '可探讨概念与策略', pitHigh: '轻视他人经验价值', tipHigh: '把想法落到实际验证' },
  { key: 'C', label: 'C 稳定性', low: '情绪易波动，敏感', high: '情绪稳定，沉着冷静', mid: '情绪较为平稳',
    matchLow: '多给肯定与支持，避免施压', pitLow: '压力下过度反应', tipLow: '规律作息，练习正念',
    matchHigh: '可放心托付压力任务', pitHigh: '显得缺乏共情', tipHigh: '主动表达情绪而非压抑' },
  { key: 'E', label: 'E 恃强性', low: '谦和顺从，愿意配合', high: '强势果决，有支配欲', mid: '适度主张自我',
    matchLow: '多鼓励表达主见', pitLow: '容易被动妥协', tipLow: '练习清晰表达自己的需要',
    matchHigh: '尊重其主导权，给决策空间', pitHigh: '过于强势引发对抗', tipHigh: '学会倾听与适当让步' },
  { key: 'F', label: 'F 兴奋性', low: '严肃内敛，沉稳克制', high: '活泼热情，追求刺激', mid: '稳重中带点活泼',
    matchLow: '减少玩笑，直接务实', pitLow: '显得沉闷压抑氛围', tipLow: '适当放松，享受乐趣',
    matchHigh: '一起参与新鲜有趣的活动', pitHigh: '注意力分散，冲动行事', tipHigh: '为重要事项设定专注时段' },
  { key: 'G', label: 'G 有恒性', low: '灵活变通，不拘规则', high: '执着尽责，坚持到底', mid: '重视责任但有弹性',
    matchLow: '给灵活空间，别用死规约束', pitLow: '承诺完成度不足', tipLow: '设定明确目标并跟进',
    matchHigh: '可托付长期责任', pitHigh: '过于固执不知变通', tipHigh: '区分原则与可以妥协的细节' },
  { key: 'H', label: 'H 敢为性', low: '谨慎胆小，回避风险', high: '大胆冒险，勇于尝试', mid: '谨慎与大胆兼具',
    matchLow: '循序渐进，降低陌生感', pitLow: '因害怕而错失机会', tipLow: '从小范围尝试开始积累勇气',
    matchHigh: '一起探索新领域', pitHigh: '鲁莽冲动忽视风险', tipHigh: '行动前快速评估关键风险' },
  { key: 'I', label: 'I 敏感性', low: '理性务实，不重感受', high: '细腻敏感，重视体验', mid: '感受与理性平衡',
    matchLow: '直白沟通，少绕情绪', pitLow: '忽略他人情绪信号', tipLow: '适度关注自己与他人的感受',
    matchHigh: '多关心其情绪体验', pitHigh: '过度敏感、易受伤', tipHigh: '区分他人情绪与自我价值' },
  { key: 'L', label: 'L 怀疑性', low: '信任他人，容易接纳', high: '警惕多疑，善于洞察', mid: '保持适度警觉',
    matchLow: '坦诚透明，不遮遮掩掩', pitLow: '容易轻信被骗', tipLow: '重要决策适当核实信息',
    matchHigh: '用事实与行动建立信任', pitHigh: '过度怀疑破坏关系', tipHigh: '给信任留出合理空间' },
  { key: 'M', label: 'M 幻想性', low: '务实落地，关注现实', high: '想象力丰富，天马行空', mid: '现实与想象兼顾',
    matchLow: '聚焦实际可行方案', pitLow: '缺乏想象与前瞻', tipLow: '允许自己偶尔畅想未来',
    matchHigh: '一起头脑风暴创意', pitHigh: '脱离现实，落地困难', tipHigh: '给创意配上行动计划' },
  { key: 'N', label: 'N 世故性', low: '坦率直白，不重包装', high: '老练圆滑，善于周旋', mid: '坦诚中带分寸',
    matchLow: '喜欢直来直去', pitLow: '过于直接引发误会', tipLow: '适当注意表达方式',
    matchHigh: '留意其话里有话', pitHigh: '显得不够真诚', tipHigh: '关键处保持真实坦诚' },
  { key: 'O', label: 'O 忧虑性', low: '自信坦然，少担忧', high: '忧思敏感，易自责', mid: '适度忧患意识',
    matchLow: '多给予正面肯定', pitLow: '忽视潜在问题', tipLow: '保持适度风险评估',
    matchHigh: '多安慰与客观反馈', pitHigh: '过度担忧、自我否定', tipHigh: '把担忧写下来逐条验证' },
  { key: 'Q1', label: 'Q1 实验性', low: '保守传统，循规蹈矩', high: '开放创新，求新求变', mid: '适度接纳新事物',
    matchLow: '尊重既有做法', pitLow: '墨守成规，错过改进', tipLow: '偶尔尝试新的做事方式',
    matchHigh: '鼓励其提出改革方案', pitHigh: '频繁变动缺乏稳定', tipHigh: '评估变更的收益与成本' },
  { key: 'Q2', label: 'Q2 独立性', low: '依赖群体，需要认同', high: '独立自主，自成一格', mid: '能独立也能合作',
    matchLow: '多提供团队支持与认同', pitLow: '缺乏主见，随波逐流', tipLow: '练习独立做小决定',
    matchHigh: '尊重其自主空间', pitHigh: '疏离团队，独自承担', tipHigh: '重要决策主动寻求外部意见' },
  { key: 'Q3', label: 'Q3 自律性', low: '随心随性，不重约束', high: '自律克制，计划明确', mid: '有一定自我约束',
    matchLow: '少用硬性计划压人', pitLow: '难以坚持长期计划', tipLow: '建立小而稳定的习惯',
    matchHigh: '可依赖其执行计划', pitHigh: '过于紧绷，缺少松弛', tipHigh: '允许偶尔放松休息' },
  { key: 'Q4', label: 'Q4 紧张性', low: '放松平和，压力感低', high: '紧张焦虑，时刻紧绷', mid: '压力感适中',
    matchLow: '营造轻松氛围', pitLow: '缺乏紧迫感', tipLow: '保持必要警觉即可',
    matchHigh: '帮助其缓解压力', pitHigh: '过度紧张影响状态', tipHigh: '运动、呼吸练习缓解紧张' },
];

const PF16_QUESTIONS = [
  { q: '与陌生人相处时，我更愿意主动攀谈、很快熟络', opts: p('A') },
  { q: '我喜欢琢磨抽象概念和复杂问题，而不是只凭经验判断', opts: p('B') },
  { q: '面对突发压力，我通常能保持冷静、不容易慌乱', opts: p('C') },
  { q: '在团队里，我倾向主动拿主意、主导节奏', opts: p('E') },
  { q: '我喜欢热闹刺激的活动，讨厌沉闷无聊', opts: p('F') },
  { q: '我认准的事会坚持到底，即使遇到困难也不轻易放弃', opts: p('G') },
  { q: '我敢于尝试有风险的新事物', opts: p('H') },
  { q: '我对艺术、氛围和他人情绪的细微变化很敏感', opts: p('I') },
  { q: '我不会轻易完全相信一个人，习惯保持警惕', opts: p('L') },
  { q: '我经常沉浸在自己的想象里，构想各种可能性', opts: p('M') },
  { q: '与人相处时，我懂得看场合、说话有分寸', opts: p('N') },
  { q: '我容易担心事情办砸，常常自我反省', opts: p('O') },
  { q: '我愿意尝试新方法，不迷信旧规矩', opts: p('Q1') },
  { q: '做决定时我更相信自己的判断，而不是随大流', opts: p('Q2') },
  { q: '我会严格要求自己按计划执行', opts: p('Q3') },
  { q: '我时常感觉紧张、心里绷着一根弦', opts: p('Q4') },
];

export const PF16_TEST: ITestDef = {
  id: '16pf',
  name: '卡特尔 16PF 人格',
  category: 'academic',
  desc: '从 16 个相互独立的人格因子精细刻画你的性格结构，是职业与人才测评常用量表之一。',
  time: '12-15 分钟',
  trust: '学术量表 · 具备实证基础',
  icon: 'Grid',
  module: '16PF',
  kind: 'dimension',
  questions: PF16_QUESTIONS,
  dimensionMeta: PF16_META,
  compute(answers) {
    const dims = buildDimensionPoints(
      PF16_LABELS.map((label) => {
        const key = label.split(' ')[0];
        return { key, label, raw: sumW(answers, key), min: -2, max: 2 };
      }),
    );
    const top = [...dims].sort((a, b) => b.percent - a.percent)[0];
    return {
      kind: 'dimension',
      summary: `16PF 从 16 个因子刻画你的人格。当前最突出的因子是「${top.label}」（${top.percent}%）。建议结合多个因子综合解读，而非只看单个分数。`,
      dimensions: dims,
      primaryKey: top.key,
      primaryName: top.label,
      tags: ['16PF', '学术量表'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= HEXACO 六维人格 ================= */
const HEXACO_META: DimensionMeta[] = [
  { key: 'H', label: 'H 诚实-谦逊', low: '务实重利，自我保护意识强', high: '真诚坦率，谦逊正直', mid: '诚实但不失现实',
    matchLow: '明确规则与利益边界', pitLow: '过度防备显得不近人情', tipLow: '在原则与变通间找平衡',
    matchHigh: '以诚相待，不必设防', pitHigh: '过于坦率易被人利用', tipHigh: '学会适当保护个人信息' },
  { key: 'E', label: 'E 情绪性', low: '冷静理性，不轻易动容', high: '情感丰富，同理心强', mid: '情绪稳定而细腻',
    matchLow: '就事论事，少渲染情绪', pitLow: '显得冷漠，忽略他人感受', tipLow: '适度表达情感连接',
    matchHigh: '多给予情感回应', pitHigh: '情绪易受波动影响', tipHigh: '建立情绪缓冲与调节习惯' },
  { key: 'X', label: 'X 外向性', low: '安静内向，重视隐私', high: '外向活跃，乐于表达', mid: '内外倾向均衡',
    matchLow: '尊重独处与边界', pitLow: '回避必要的对外沟通', tipLow: '扩大安全社交范围',
    matchHigh: '鼓励其表达与连接', pitHigh: '过度外放忽视内心', tipHigh: '留出自我沉淀的时间' },
  { key: 'A', label: 'A 宜人性', low: '坚持己见，直接对抗', high: '宽容合作，心软随和', mid: '宽容而有原则',
    matchLow: '就事论事，避免情绪化', pitLow: '强硬导致关系紧张', tipLow: '练习换位思考与妥协',
    matchHigh: '温和沟通，互相体谅', pitHigh: '过度忍让委屈自己', tipHigh: '学会合理拒绝' },
  { key: 'C', label: 'C 尽责性', low: '随性灵活，不拘小节', high: '自律专注，有条不紊', mid: '自律且懂得变通',
    matchLow: '保留弹性，别苛求计划', pitLow: '细节疏漏，拖延误事', tipLow: '用清单管理关键任务',
    matchHigh: '可放心托付执行', pitHigh: '过于较真、压力大', tipHigh: '允许适度的灵活与放松' },
  { key: 'O', label: 'O 开放性', low: '务实传统，求稳', high: '好奇开放，热衷探索', mid: '务实中带点好奇',
    matchLow: '讲现实价值，少空泛概念', pitLow: '对新事物接受慢', tipLow: '偶尔尝试新体验',
    matchHigh: '一起探讨创意与新知', pitHigh: '想法过多难以落地', tipHigh: '为好奇配上行动闭环' },
];

const HEXACO_QUESTIONS = [
  { q: '即便没人看见，我也会恪守承诺、不占便宜', opts: p('H') },
  { q: '看到别人难过，我常常感同身受、情绪被牵动', opts: p('E') },
  { q: '我乐于参加聚会，并享受成为人群焦点', opts: p('X') },
  { q: '与人发生分歧时，我倾向于让步以维持和气', opts: p('A') },
  { q: '我会提前规划并按计划推进事情', opts: p('C') },
  { q: '我对艺术、旅行和新观点充满好奇', opts: p('O') },
  { q: '为了达成目标，我愿意灵活处理道德底线', opts: p('H', true) },
  { q: '面对压力我通常波澜不惊、不容易被触动', opts: p('E', true) },
  { q: '我更喜欢安静地独处，而不是频繁社交', opts: p('X', true) },
  { q: '原则问题上我寸步不让，不会轻易妥协', opts: p('A', true) },
  { q: '我做事比较随性，常常临时起意', opts: p('C', true) },
  { q: '我更愿意按熟悉的方式做事，不喜欢变来变去', opts: p('O', true) },
];

export const HEXACO_TEST: ITestDef = {
  id: 'hexaco',
  name: 'HEXACO 六维人格',
  category: 'academic',
  desc: '在大五人格基础上增加「诚实-谦逊」维度，六个维度更完整地刻画人格。',
  time: '9-13 分钟',
  trust: '学术量表 · 具备实证基础',
  icon: 'Hexagon',
  module: 'HEXACO',
  kind: 'dimension',
  questions: HEXACO_QUESTIONS,
  dimensionMeta: HEXACO_META,
  compute(answers) {
    const map = { H: '诚实-谦逊', E: '情绪性', X: '外向性', A: '宜人性', C: '尽责性', O: '开放性' } as const;
    const dims = buildDimensionPoints(
      (Object.keys(map) as Array<keyof typeof map>).map((k) => ({
        key: k, label: `${k} ${map[k]}`, raw: sumW(answers, k), min: -4, max: 4,
      })),
    );
    const top = [...dims].sort((a, b) => b.percent - a.percent)[0];
    return {
      kind: 'dimension',
      summary: `HEXACO 中你最突出的维度是「${top.label}」（${top.percent}%）。六个维度共同构成你的人格画像，重点看相对强弱而非绝对分数。`,
      dimensions: dims,
      primaryKey: top.key,
      primaryName: top.label,
      tags: ['HEXACO', '学术量表'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= EPQ 艾森克人格 ================= */
const EPQ_META: DimensionMeta[] = [
  { key: 'E', label: 'E 内外向', low: '内向安静，偏好独处', high: '外向活跃，社交为乐', mid: '内外向适中',
    matchLow: '尊重独处，减少无效社交', pitLow: '社交消耗大，易被孤立', tipLow: '发展低压力的小圈子',
    matchHigh: '多安排互动与合作', pitHigh: '静不下来，易分心', tipHigh: '训练深度专注' },
  { key: 'N', label: 'N 神经质', low: '情绪稳定，不易焦虑', high: '情绪敏感，容易紧张', mid: '情绪较为平稳',
    matchLow: '客观直接沟通', pitLow: '忽视潜在情绪风险', tipLow: '保持适度警觉',
    matchHigh: '多安抚，减少刺激', pitHigh: '过度焦虑影响判断', tipHigh: '规律作息+运动缓解' },
  { key: 'P', label: 'P 精神质', low: '温和合群，随和好相处', high: '独立倔强，自我主张强', mid: '温和中带主见',
    matchLow: '温和协作即可', pitLow: '过于迎合缺乏立场', tipLow: '敢于表达不同意见',
    matchHigh: '尊重其独立空间', pitHigh: '固执易冲动', tipHigh: '冲动前先冷静三秒' },
  { key: 'L', label: 'L 掩饰性', low: '坦诚直率，不擅伪装', high: '自我形象管理强，答题有所保留', mid: '有一定保留',
    matchLow: '直来直去沟通', pitLow: '过于直白', tipLow: '注意场合分寸',
    matchHigh: '留意其真实想法', pitHigh: '回避真实自我', tipHigh: '在安全关系里放松表达' },
];

const EPQ_QUESTIONS = [
  { q: '热闹的聚会能让我精神振奋', opts: p('E') },
  { q: '我常因琐事感到心烦意乱', opts: p('N') },
  { q: '别人说我有点我行我素', opts: p('P') },
  { q: '我平时很少让别人看到真实的自己', opts: p('L') },
  { q: '我宁愿一个人安静待着，也不想参加喧闹活动', opts: p('E', true) },
  { q: '我情绪平稳，很少大起大落', opts: p('N', true) },
  { q: '我很随和，基本不与人为难', opts: p('P', true) },
  { q: '我做事从不遮遮掩掩，很透明', opts: p('L', true) },
  { q: '我交朋友快，在人群里如鱼得水', opts: p('E') },
  { q: '我常常睡不好，脑子停不下来', opts: p('N') },
  { q: '我讨厌别人管着我，喜欢自己做主', opts: p('P') },
  { q: '我偶尔也会夸大或隐瞒一些细节', opts: p('L') },
];

export const EPQ_TEST: ITestDef = {
  id: 'epq',
  name: 'EPQ 艾森克人格问卷',
  category: 'academic',
  desc: '从内外向、神经质、精神质三个维度评估气质类型，并含测谎量表检验作答效度。',
  time: '5-8 分钟',
  trust: '学术量表 · 具备实证基础',
  icon: 'Activity',
  module: 'EPQ',
  kind: 'dimension',
  questions: EPQ_QUESTIONS,
  dimensionMeta: EPQ_META,
  compute(answers) {
    const map = { E: '内外向', N: '神经质', P: '精神质', L: '掩饰性' } as const;
    const dims = buildDimensionPoints(
      (Object.keys(map) as Array<keyof typeof map>).map((k) => ({
        key: k, label: `${k} ${map[k]}`, raw: sumW(answers, k), min: -3, max: 3,
      })),
    );
    const l = dims.find((d) => d.key === 'L');
    return {
      kind: 'dimension',
      summary: `EPQ 综合评估你的气质类型。${l && l.level === 'high' ? '你的掩饰性较高，作答可能有所保留，结果供参考。' : '作答效度良好，结果较可靠。'}`,
      dimensions: dims,
      tags: ['EPQ', '学术量表'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= 成人依恋类型 ================= */
const ATTACHMENT_QUESTIONS = [
  { q: '我常常担心伴侣并不是真的那么爱我', opts: p('anx') },
  { q: '我不太习惯完全依赖或信任别人', opts: p('av') },
  { q: '关系一有波动，我就会坐立不安、想很多', opts: p('anx') },
  { q: '靠得太近会让我感到不适，想拉开距离', opts: p('av') },
  { q: '我容易怀疑对方会离开我，需要反复确认', opts: p('anx') },
  { q: '遇到困难我更愿意自己扛，而不是求助', opts: p('av') },
  { q: '对方稍有冷淡，我就会怀疑是不是自己做错了', opts: p('anx') },
  { q: '亲密关系里我很难真正敞开心扉', opts: p('av') },
];

export const ATTACHMENT_TEST: ITestDef = {
  id: 'attachment',
  name: '成人依恋类型测试',
  category: 'academic',
  desc: '从焦虑与回避两个核心维度评估你在亲密关系中的依恋模式。',
  time: '6-8 分钟',
  trust: '学术量表 · 具备实证基础',
  icon: 'HeartHandshake',
  module: 'ATTACHMENT',
  kind: 'attachment',
  questions: ATTACHMENT_QUESTIONS,
  compute(answers) {
    const anx = sumW(answers, 'anx');
    const av = sumW(answers, 'av');
    const A = pctOf(anx, -4, 4);
    const V = pctOf(av, -4, 4);
    const anxHigh = A >= 55;
    const avHigh = V >= 55;
    const type = !anxHigh && !avHigh ? '安全型' : anxHigh && !avHigh ? '焦虑型' : !anxHigh && avHigh ? '回避型' : '恐惧-回避型';
    const meta: Record<string, { desc: string; adv: string; risk: string; match: string; pit: string; tip: string }> = {
      安全型: {
        desc: '能够安心信任伴侣，不怕亲密，也接受独立空间；相信自己值得被爱，也相信他人。',
        adv: '善于经营健康关系，既能亲密也能保持自我',
        risk: '需要留意关系中对方未表达的困扰',
        match: '坦诚沟通感受，直接表达需求即可',
        pit: '偶尔把稳定当作理所当然，忽略对方情绪',
        tip: '保持主动沟通与关心，别让默契变成疏远',
      },
      焦虑型: {
        desc: '渴望亲密，但常怀疑对方爱意，害怕被抛弃，容易过度敏感、情绪随关系波动。',
        adv: '情感投入深，感知关系变化敏锐',
        risk: '容易过度解读、情绪内耗',
        match: '需要稳定回应与确认，避免忽冷忽热',
        pit: '用反复试探换取安全感，反而推远对方',
        tip: '把「担心」写出来核对事实，别靠脑补下结论',
      },
      回避型: {
        desc: '重视个人独立，对深度亲密感到不适，习惯压抑情感，冲突时倾向拉开距离。',
        adv: '独立自主，不轻易依赖他人',
        risk: '情感疏离，难以真正敞开心扉',
        match: '不要逼迫立刻袒露内心，给予足够独立空间',
        pit: '用逃避应对矛盾，让问题越积越多',
        tip: '练习适度袒露脆弱，从小事表达开始',
      },
      '恐惧-回避型': {
        desc: '既渴望亲密又害怕受伤，既难信任自己也难信任他人，内心常感矛盾纠结。',
        adv: '对关系风险高度敏感，能保护自己',
        risk: '反复拉扯，情绪消耗大',
        match: '放缓节奏，避免过快投入深度亲密',
        pit: '在「想靠近」与「想逃离」间摇摆伤害彼此',
        tip: '先建立安全感和自我价值，再谈深入关系',
      },
    };
    const m = meta[type];
    return {
      kind: 'attachment',
      summary: `你的成人依恋类型为「${type}」。依恋模式受早年经历影响，但它并非一成不变，可以通过后天练习逐渐改善。`,
      attachment: { type, anx: A, av: V, desc: m.desc, adv: m.adv, risk: m.risk, match: m.match, pit: m.pit, tip: m.tip },
      primaryName: type,
      tags: ['依恋', '学术量表'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= EQ 情商测试 ================= */
const EQ_META: DimensionMeta[] = [
  { key: 'SA', label: '自我觉察', low: '对自身情绪识别不足', high: '能清晰觉察并理解自己的情绪', mid: '情绪觉察力中等',
    matchLow: '用具体描述帮助其认清感受', pitLow: '情绪上头而不自知', tipLow: '每天记录自己的情绪触发点',
    matchHigh: '可与其讨论情绪动机', pitHigh: '过度分析导致内耗', tipHigh: '觉察后也要学会放下' },
  { key: 'EM', label: '共情', low: '较难体会他人感受', high: '能敏锐共情他人处境', mid: '有一定共情能力',
    matchLow: '把感受说清楚，别只讲道理', pitLow: '无意中显得冷漠', tipLow: '多问「你当时是什么感受」',
    matchHigh: '善于倾听与陪伴', pitHigh: '过度卷入他人情绪', tipHigh: '共情他人也守住自己边界' },
  { key: 'SR', label: '情绪调节', low: '情绪波动时较难平复', high: '能较快调节稳定情绪', mid: '情绪调节能力尚可',
    matchLow: '给缓冲时间，避免火上浇油', pitLow: '冲动言行事后后悔', tipLow: '情绪上头先深呼吸/离开现场',
    matchHigh: '可在压力下依靠其稳定', pitHigh: '压抑情绪不表达', tipHigh: '有情绪及时释放而非压制' },
  { key: 'SO', label: '社交经营', low: '处理人际冲突较吃力', high: '善于经营关系与化解矛盾', mid: '社交能力中等',
    matchLow: '明确表达期待，减少猜谜', pitLow: '冲突升级或冷战', tipLow: '练习「先倾听再回应」',
    matchHigh: '可委以协调沟通任务', pitHigh: '过度讨好维持和睦', tipHigh: '敢于表达真实立场' },
];

const EQ_QUESTIONS = [
  { q: '我能清楚识别自己当下的情绪是什么', opts: p('SA') },
  { q: '我能敏锐察觉别人的情绪变化', opts: p('EM') },
  { q: '情绪上来时，我能较快让自己冷静下来', opts: p('SR') },
  { q: '我擅长调解人际矛盾、缓和气氛', opts: p('SO') },
  { q: '我常常说不清自己为什么会情绪不好', opts: p('SA', true) },
  { q: '我很难真正体会别人的处境和感受', opts: p('EM', true) },
  { q: '一点小挫折就能让我失控很久', opts: p('SR', true) },
  { q: '遇到冲突我容易逃避或越吵越僵', opts: p('SO', true) },
  { q: '情绪波动后，我会复盘反思自己的反应', opts: p('SA') },
  { q: '我在团队里能带动氛围、凝聚人心', opts: p('SO') },
];

export const EQ_TEST: ITestDef = {
  id: 'eq',
  name: 'EQ 情商测试',
  category: 'academic',
  desc: '评估自我觉察、共情、情绪调节、社交经营四个维度的情绪智力。',
  time: '6-9 分钟',
  trust: '学术量表 · 具备实证基础',
  icon: 'Smile',
  module: 'EQ',
  kind: 'dimension',
  questions: EQ_QUESTIONS,
  dimensionMeta: EQ_META,
  compute(answers) {
    const map = { SA: '自我觉察', EM: '共情', SR: '情绪调节', SO: '社交经营' } as const;
    const range = { SA: 6, EM: 4, SR: 4, SO: 6 } as const;
    const dims = buildDimensionPoints(
      (Object.keys(map) as Array<keyof typeof map>).map((k) => ({
        key: k, label: `${map[k]}`, raw: sumW(answers, k), min: -range[k], max: range[k],
      })),
    );
    const avg = Math.round(dims.reduce((s, d) => s + d.percent, 0) / dims.length);
    const level = avg >= 60 ? '较好' : avg >= 40 ? '中等' : '有提升空间';
    return {
      kind: 'dimension',
      summary: `你的整体情商水平为「${level}」（综合 ${avg}%）。情商不是天生固定的，可以通过刻意练习提升。`,
      dimensions: dims,
      tags: ['EQ', '学术量表'],
      disclaimer: DISCLAIMER,
    };
  },
};

