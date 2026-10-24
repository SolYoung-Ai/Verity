// 网络流行人格测试题库：MBTI、九型人格、DISC、凯尔西、盖洛普
// EXPORTS: MBTI_TEST, ENNEAGRAM_TEST, DISC_TEST, KEIRSEY_TEST, GALLUP_TEST
import type { ITestDef, ITypePoint, IOption, TypeMeta } from '@/data/types';
import { sumW } from '@/lib/scoring';

const DISCLAIMER =
  '本测试仅为性格倾向参考，学术上存在较大争议，不能替代专业评估，请勿用于招聘、婚恋、升学等重大决策，也不要拿结果给自己贴死标签。';

const LIKERT5 = [
  { text: '非常不同意', w: { _: -2 } },
  { text: '不太同意', w: { _: -1 } },
  { text: '中立', w: { _: 0 } },
  { text: '比较同意', w: { _: 1 } },
  { text: '非常同意', w: { _: 2 } },
];
const p = (key: string, reverse = false): IOption[] =>
  LIKERT5.map((o) => ({ text: o.text, w: { [key]: reverse ? -(o.w._) : o.w._ } }));

/* ================= MBTI 16 型人格（含 A/T） ================= */
export const MBTI_TEST: ITestDef = {
  id: 'mbti',
  name: 'MBTI 16 型人格 (A/T)',
  category: 'popular',
  desc: '基于认知偏好模型，从精力来源、信息接收、决策方式、生活方式四个维度判断你的类型，并区分自信 A / 动荡 T 亚型。',
  time: '7-10 分钟',
  trust: '流行测评 · 学术争议较大，仅供参考',
  icon: 'Brain',
  module: 'MBTI',
  kind: 'mbti',
  questions: [
    { q: '忙碌的社交之后，我需要独处才能恢复精力', opts: p('I') },
    { q: '比起现实细节，我更关注潜在的种种可能性', opts: p('N') },
    { q: '做决定时，我优先考虑人情与感受而非冷冰冰的逻辑', opts: p('F') },
    { q: '我喜欢保留灵活选项，不愿过早把安排定死', opts: p('P') },
    { q: '我常常担心自己做得不够好，容易自我怀疑', opts: p('Turb') },
    { q: '我乐于与人交往，并从互动中获得能量', opts: p('E') },
    { q: '我更相信眼见为实的具体信息，而非抽象联想', opts: p('S') },
    { q: '做决定时，我优先讲逻辑对错而不是照顾感受', opts: p('T') },
    { q: '我偏好提前规划、按部就班地推进', opts: p('J') },
    { q: '我对自己的能力和判断通常很笃定', opts: p('Ass') },
    { q: '我经常忍不住构想未来会发生什么', opts: p('N') },
    { q: '我很难做出会伤害他人感受的决定', opts: p('F') },
  ],
  compute(answers) {
    const s = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0, Ass: 0, Turb: 0 };
    answers.forEach((a) => Object.entries(a.w ?? {}).forEach(([k, v]) => (s[k] = (s[k] ?? 0) + v)));
    const l1 = s.E >= s.I ? 'E' : 'I';
    const l2 = s.S >= s.N ? 'S' : 'N';
    const l3 = s.T >= s.F ? 'T' : 'F';
    const l4 = s.J >= s.P ? 'J' : 'P';
    const base = l1 + l2 + l3 + l4;
    const isT = s.Turb > s.Ass;
    const code = base + (isT ? '-T' : '-A');

    const letterDesc = [
      `${l1 === 'E' ? 'E 外向' : 'I 内向'}：${l1 === 'E' ? '从社交互动获取能量，先想再说' : '靠独处与思考恢复精力，先想后说'}`,
      `${l2 === 'S' ? 'S 实感' : 'N 直觉'}：${l2 === 'S' ? '重视现实细节、经验与看得见的事实' : '关注联想、可能性与未来趋势'}`,
      `${l3 === 'T' ? 'T 思考' : 'F 情感'}：${l3 === 'T' ? '优先逻辑、客观与利弊对错' : '优先人的感受、价值观与和谐'}`,
      `${l4 === 'J' ? 'J 判断' : 'P 感知'}：${l4 === 'J' ? '偏好计划、确定、尽早落地' : '偏好灵活开放，保留选择空间'}`,
    ];

    const N = l2 === 'N';
    const T = l3 === 'T';
    const J = l4 === 'J';
    return {
      kind: 'mbti',
      summary: `你的人格类型为 ${code}。${isT ? 'T 动荡型：自我要求高，常反思改进，但也容易焦虑内耗' : 'A 自信型：心态笃定，对自我接纳度高，但可能忽视反馈'}。请记住：MBTI 描述的是偏好而非能力，同一类型的人差异依然巨大。`,
      mbti: {
        code, base, isT, letterDesc,
        adv: `擅长${T ? '逻辑分析推演' : '共情体察他人'}，${N ? '捕捉潜在可能性' : '处理现实具体事务'}，${J ? '执行力强、善做计划' : '应变灵活、随机而动'}`,
        risk: `${J ? '容易过早下定论、排斥突发变化' : '容易拖延、缺少闭环执行'}；${isT ? '常陷入过度自我批判' : '有时过度自信、忽略反馈'}`,
        match: T
          ? '沟通优先讲事实逻辑，别用情绪化绑架'
          : '沟通先照顾感受，别冷冰冰只讲道理',
        pit: `压力状态下${isT ? '极易自我否定、反复纠结过去失误' : '容易固执己见、忽略他人信号'}，是人际中最容易踩坑的场景`,
        tip: '1) 看见相反维度的价值，不否定对立面；2) ' + (isT ? '减少过度自我批判，接纳不完美' : '学会复盘反思，别过度自信') + '；3) MBTI 是偏好不是能力，别给自己贴死标签',
      },
      primaryName: code,
      tags: ['MBTI', '流行测评'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= 九型人格 ================= */
const ENNEAGRAM_META: Record<string, TypeMeta> = {
  e1: {
    name: '1 号 完美型', desc: '核心恐惧：害怕做错、腐化堕落\n核心欲望：追求公正、正确与完善\n常见侧翼：2号 / 9号\n健康层级：理性客观，接纳不完美，追求改良而非苛责\n压力状态（解离）：向 4 号滑落，陷入伤感、自我批判\n安全状态（整合）：向 7 号，变得轻松乐观，懂得享受',
    adv: '原则性强，追求卓越，值得信赖', risk: '对自己和别人都过于苛刻',
    match: '多肯定其努力，不要只盯着错误', pit: '过度挑剔让人压力很大', tip: '允许自己和他人「不完美」，宽容一点',
  },
  e2: {
    name: '2 号 助人型', desc: '核心恐惧：害怕不被爱、被抛弃\n核心欲望：被需要、获得爱\n常见侧翼：1号 / 3号\n健康层级：无条件关怀，懂得自爱，不靠付出换取爱\n压力状态（解离）：向 8 号，变得强硬、索取回报\n安全状态（整合）：向 4 号，看见自身真实情绪',
    adv: '体贴周到，乐于付出，温暖人心', risk: '容易讨好，忽略自己的需求',
    match: '真诚感谢其付出，也关心其需求', pit: '用过度付出来换取认可，委屈自己', tip: '先照顾好自己，再帮助别人',
  },
  e3: {
    name: '3 号 成就型', desc: '核心恐惧：害怕失败、一无是处\n核心欲望：被认可、获得成功\n常见侧翼：2号 / 4号\n健康层级：自信务实，接纳真实自我，不只活在评价里\n压力状态（解离）：向 9 号，摆烂麻木、回避现实\n安全状态（整合）：向 6 号，谨慎踏实、考虑风险',
    adv: '目标感强，执行力高，善于成就', risk: '过度在意他人评价，忽略内心',
    match: '认可其成就，也关心其疲惫', pit: '为了表现而透支自己', tip: '慢下来，问问自己真正想要什么',
  },
  e4: {
    name: '4 号 自我型', desc: '核心恐惧：害怕平庸、缺失自我\n核心欲望：独特，找到自我意义\n常见侧翼：3号 / 5号\n健康层级：接纳平凡，把感受转化为创造\n压力状态（解离）：向 2 号，讨好渴望被接纳\n安全状态（整合）：向 1 号，理性自律、落地现实',
    adv: '细腻深刻，富有创造力与审美', risk: '容易沉浸在情绪里，自我怀疑',
    match: '尊重其独特性，看见并共情其感受', pit: '过度内耗、放大遗憾', tip: '把情绪转化成创作或行动，而不是空想',
  },
  e5: {
    name: '5 号 理智型', desc: '核心恐惧：害怕资源耗尽、被索取掏空\n核心欲望：获得知识、保全能量\n常见侧翼：4号 / 6号\n健康层级：愿意输出分享，适度向外连接\n压力状态（解离）：向 7 号，不停逃避、追逐新鲜刺激\n安全状态（整合）：向 8 号，敢于行动表达立场',
    adv: '冷静理性，善于钻研，洞察力强', risk: '过度抽离，回避情感连接',
    match: '给足独立空间，不要逼迫其敞开心扉', pit: '把自己封闭起来，错过连接', tip: '适度表达想法，主动建立人际连接',
  },
  e6: {
    name: '6 号 忠诚型', desc: '核心恐惧：害怕危险、失去依靠\n核心欲望：安全感与可靠支撑\n常见侧翼：5号 / 7号\n健康层级：内心笃定，敢于信任自我判断\n压力状态（解离）：向 3 号，疯狂追求成功证明自己\n安全状态（整合）：向 9 号，平和松弛、放下焦虑',
    adv: '忠诚可靠，考虑周全，未雨绸缪', risk: '容易多疑焦虑，陷入内耗',
    match: '给予稳定与确定感，说到做到', pit: '过度担忧放大风险，拖累决策', tip: '把担忧写下来逐条验证，建立安全感',
  },
  e7: {
    name: '7 号 活跃型', desc: '核心恐惧：害怕痛苦、被限制\n核心欲望：快乐、更多可能性\n常见侧翼：6号 / 8号\n健康层级：可以承受痛苦，专注深耕一件事\n压力状态（解离）：向 1 号，挑剔苛责、对现实不满\n安全状态（整合）：向 5 号，向内沉淀、深度思考',
    adv: '乐观热情，点子多，富有感染力', risk: '难以专注，逃避痛苦与责任',
    match: '一起找乐趣，也给其自由空间', pit: '三分钟热度，难深入', tip: '为热爱配上坚持，学会面对不如意',
  },
  e8: {
    name: '8 号 领袖型', desc: '核心恐惧：害怕被控制、软弱受欺负\n核心欲望：独立自主、掌控局面\n常见侧翼：7号 / 9号\n健康层级：懂得温柔，学会示弱体谅他人\n压力状态（解离）：向 5 号，封闭隔绝、拒绝外界\n安全状态（整合）：向 2 号，主动关怀照顾别人',
    adv: '果敢担当，保护欲强，有领导力', risk: '强势固执，容易忽略他人感受',
    match: '平等对话，尊重其主导权', pit: '对抗冲动，把商量变成命令', tip: '学会示弱与倾听，适当放下控制',
  },
  e9: {
    name: '9 号 和平型', desc: '核心恐惧：害怕冲突、分离\n核心欲望：内在平和、万物和谐\n常见侧翼：8号 / 1号\n健康层级：敢于表达立场，直面冲突\n压力状态（解离）：向 6 号，多疑焦虑、放大危险\n安全状态（整合）：向 3 号，积极进取、追求目标',
    adv: '包容平和，善于调停，让人安心', risk: '回避冲突，压抑自己的需求',
    match: '温和提问，鼓励其说出真实想法', pit: '一味顺从，丧失自我', tip: '练习表达立场，小事上也敢说「不」',
  },
};

export const ENNEAGRAM_TEST: ITestDef = {
  id: 'enneagram',
  name: '九型人格 Enneagram',
  category: 'popular',
  desc: '通过核心恐惧与欲望识别你的人格类型，并结合侧翼、健康层级与压力/安全状态提供完整解读。',
  time: '8-11 分钟',
  trust: '流行测评 · 学术争议较大，仅供参考',
  icon: 'Layers',
  module: 'ENNEAGRAM',
  kind: 'topType',
  questions: [
    { q: '我追求把事情做到完美，常挑剔自己或别人不够好', opts: p('e1') },
    { q: '我习惯照顾别人，希望被大家需要', opts: p('e2') },
    { q: '我很在意成就和外界认可，希望展现优秀的一面', opts: p('e3') },
    { q: '我容易沉浸在情绪里，向往独特深刻的体验', opts: p('e4') },
    { q: '我更喜欢观察思考，不愿卷入太多情绪琐事', opts: p('e5') },
    { q: '我习惯为未来担忧，做事谨慎、未雨绸缪', opts: p('e6') },
    { q: '我追求新鲜有趣，讨厌被束缚和无聊', opts: p('e7') },
    { q: '我敢作敢当，喜欢掌控局面', opts: p('e8') },
    { q: '我最怕冲突，凡事总想让大家都舒服', opts: p('e9') },
    { q: '看到不整洁或出错，我会很不舒服并想纠正', opts: p('e1') },
    { q: '我不太会拒绝别人，常把别人的事当自己的事', opts: p('e2') },
    { q: '我不太能接受自己一事无成、平庸度日', opts: p('e3') },
    { q: '我常有「我不够特别」的失落感', opts: p('e4') },
    { q: '社交会消耗我，我更需要自己的空间', opts: p('e5') },
    { q: '决定前我总要反复确认、多打听几遍', opts: p('e6') },
    { q: '我不喜欢被计划绑死，临场发挥才过瘾', opts: p('e7') },
    { q: '我习惯替别人出头、做决定', opts: p('e8') },
    { q: '为了和气，我常常压下自己的真实想法', opts: p('e9') },
  ],
  typesMeta: ENNEAGRAM_META,
  compute(answers) {
    const types: ITypePoint[] = Object.keys(ENNEAGRAM_META).map((k) => ({
      key: k, name: ENNEAGRAM_META[k].name, score: sumW(answers, k),
    }));
    const sorted = [...types].sort((a, b) => b.score - a.score);
    const primary = sorted[0];
    return {
      kind: 'topType',
      summary: `你的主导人格类型为「${primary.name}」。注意九型常有主导型和侧翼并存，压力状态还会让你表现出其他类型的特质，请综合看待。`,
      types: sorted,
      primaryKey: primary.key,
      primaryName: primary.name,
      tags: ['九型人格', '流行测评'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= DISC 行为风格 ================= */
const DISC_META: Record<string, TypeMeta> = {
  D: {
    name: 'D 支配型', desc: '目标导向，果决敢拍板，追求结果与掌控；在压力下更直接、更强势。',
    adv: '执行力强，敢于拍板，推动目标达成', risk: '容易强势，忽略他人感受与细节',
    match: '沟通直接讲结果，少绕圈子；尊重其主导权', pit: '职场最易踩坑：说话太硬、不给别人表达空间', tip: '多倾听，给别人留出表达与缓冲',
  },
  I: {
    name: 'I 影响型', desc: '乐观外向，擅长说服与感染他人，喜欢表达和被关注。',
    adv: '感染力强，擅长建立人际连接、调动氛围', risk: '容易忽略落地细节，承诺偏多',
    match: '多给予赞美鼓励，倾听其想法创意', pit: '职场最易踩坑：热情构想后不补落地细节', tip: '热血之后列出可执行的步骤清单',
  },
  S: {
    name: 'S 稳健型', desc: '温和耐心，重视稳定协作，习惯默默配合、维持和谐。',
    adv: '耐心可靠，善于维持团队和睦', risk: '害怕冲突，不敢表达反对意见',
    match: '循序渐进，给足适应变化的缓冲', pit: '职场最易踩坑：一味顺从，意见被忽略', tip: '练习在关键处清晰表达自己的立场',
  },
  C: {
    name: 'C 谨慎尽责型', desc: '严谨重逻辑，追求准确与规则，做事谨慎、讲求质量。',
    adv: '严谨审慎，重视质量与数据依据', risk: '容易陷入细节，决策偏慢',
    match: '提供数据与逻辑依据再沟通', pit: '职场最易踩坑：在次要细节无限消耗、拖延决策', tip: '分清主次，重要的事先推进再完善',
  },
};

export const DISC_TEST: ITestDef = {
  id: 'disc',
  name: 'DISC 行为风格测试',
  category: 'popular',
  desc: '评估你在支配 D、影响 I、稳健 S、谨慎 C 四种行为风格上的偏好。DISC 测的是外在行为模式而非内在人格，场景不同表现可以变化。',
  time: '6-9 分钟',
  trust: '流行测评 · 学术争议较大，仅供参考',
  icon: 'Zap',
  module: 'DISC',
  kind: 'topType',
  questions: [
    { q: '遇到问题我倾向快速拍板、推动落地', opts: p('D') },
    { q: '我喜欢直接指挥、掌握进度', opts: p('D') },
    { q: '面对挑战我越挫越勇、不愿示弱', opts: p('D') },
    { q: '我善于调动氛围、感染身边的人', opts: p('I') },
    { q: '我喜欢表达分享、乐于交朋友', opts: p('I') },
    { q: '我擅长用热情说服别人', opts: p('I') },
    { q: '我追求安稳，讨厌突如其来的剧变', opts: p('S') },
    { q: '我习惯默默配合、照顾大家的节奏', opts: p('S') },
    { q: '我做事耐心细致、讲求可靠', opts: p('S') },
    { q: '我做事情重规则、讲数据', opts: p('C') },
    { q: '我对准确性有执念，不容含糊', opts: p('C') },
    { q: '我习惯先想清楚再行动，不冲动', opts: p('C') },
  ],
  typesMeta: DISC_META,
  compute(answers) {
    const types: ITypePoint[] = Object.keys(DISC_META).map((k) => ({
      key: k, name: DISC_META[k].name, score: sumW(answers, k),
    }));
    const sorted = [...types].sort((a, b) => b.score - a.score);
    const primary = sorted[0];
    return {
      kind: 'topType',
      summary: `你的主导行为风格为「${primary.name}」。DISC 描述的是你在职场/社交中的外在行为偏好，可根据不同对象灵活调整沟通方式。`,
      types: sorted,
      primaryKey: primary.key,
      primaryName: primary.name,
      tags: ['DISC', '流行测评'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= 凯尔西气质分类 ================= */
const KEIRSEY_META: Record<string, TypeMeta> = {
  NT: {
    name: 'NT 理性者（直觉+思考）', desc: '追求能力、知识与逻辑，喜欢钻研原理、解决问题，理性而独立。',
    adv: '逻辑严密，擅长分析和创新', risk: '显得理性冷峻，忽略人情',
    match: '谈思路与逻辑，别用情感绑架', pit: '过度较真、抬杠，让人难以相处', tip: '多关注他人的情感与实际需求',
  },
  NF: {
    name: 'NF 理想主义者（直觉+情感）', desc: '追求意义、成长与人际和谐，重视关系、共情与内在价值。',
    adv: '共情力强，善于激励与沟通', risk: '理想化，容易失望，回避冲突',
    match: '真诚交流，认可其价值观', pit: '用理想要求现实，容易内耗', tip: '把理想拆成可落地的行动',
  },
  SJ: {
    name: 'SJ 护卫者（实感+判断）', desc: '追求责任、秩序与安全感，重视规则、传统和踏实执行。',
    adv: '靠谱守约，组织能力强，值得信赖', risk: '抗拒变化，略显保守',
    match: '明确规则与预期，尊重稳定节奏', pit: '过度刻板，错失灵活机会', tip: '适当接受变通与创新',
  },
  SP: {
    name: 'SP 技艺者（实感+感知）', desc: '追求行动、刺激与当下体验，反应快、动手能力强、灵活务实。',
    adv: '应变敏捷，动手能力强，活在当下', risk: '缺乏长远规划，冲动多变',
    match: '一起动手体验，别空谈计划', pit: '三分钟热度，难持续', tip: '为冲动配上长期目标',
  },
};

export const KEIRSEY_TEST: ITestDef = {
  id: 'keirsey',
  name: '凯尔西气质分类',
  category: 'popular',
  desc: '将 MBTI 四个维度归并为四种气质：理性者 NT、理想主义者 NF、护卫者 SJ、技艺者 SP。',
  time: '7-10 分钟',
  trust: '流行测评 · 学术争议较大，仅供参考',
  icon: 'Flame',
  module: 'KEIRSEY',
  kind: 'topType',
  questions: [
    { q: '我享受钻研原理、解决复杂问题', opts: p('NT') },
    { q: '我更看重能力与见识，而不是身份地位', opts: p('NT') },
    { q: '我重视人际关系与事情的内在意义', opts: p('NF') },
    { q: '我常想象他人和事情更好的可能', opts: p('NF') },
    { q: '我重视责任与秩序，习惯遵守规则', opts: p('SJ') },
    { q: '我倾向按稳妥成熟的方式把事情办妥', opts: p('SJ') },
    { q: '我反应快，喜欢动手实践、即时反馈', opts: p('SP') },
    { q: '我讨厌被计划绑死，喜欢随性行动', opts: p('SP') },
  ],
  typesMeta: KEIRSEY_META,
  compute(answers) {
    const types: ITypePoint[] = Object.keys(KEIRSEY_META).map((k) => ({
      key: k, name: KEIRSEY_META[k].name, score: sumW(answers, k),
    }));
    const sorted = [...types].sort((a, b) => b.score - a.score);
    const primary = sorted[0];
    return {
      kind: 'topType',
      summary: `你的气质类型为「${primary.name}」。气质倾向决定你舒服的做事与相处方式，善用其长、补齐其短。`,
      types: sorted,
      primaryKey: primary.key,
      primaryName: primary.name,
      tags: ['凯尔西', '流行测评'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= 盖洛普优势识别 ================= */
const GALLUP_META: Record<string, TypeMeta> = {
  achiever: {
    name: '成就', desc: '渴望每天都有产出，享受把事情一件件做完的充实感。',
    adv: '精力充沛，持续产出', risk: '停不下来，容易透支',
    match: '认可其成果，给足任务量', pit: '把休息也当成「没产出」，长期紧绷', tip: '把「完成」与「休息」都规划进日程',
  },
  action: {
    name: '行动', desc: '想到就做，靠行动推进，讨厌拖延。',
    adv: '执行力强，快速推进', risk: '考虑不足，容易莽撞',
    match: '给其空间去执行', pit: '还没想清就冲，返工率高', tip: '行动前快速过一遍关键风险',
  },
  analytical: {
    name: '分析', desc: '凡事讲数据、讲逻辑，喜欢把问题想透彻。',
    adv: '思虑周全，决策有据', risk: '过度分析、迟迟不决',
    match: '给数据与推理空间', pit: '陷入分析瘫痪', tip: '设定分析的时间上限',
  },
  communication: {
    name: '沟通', desc: '喜欢表达、讲解和连接，善于把信息讲明白。',
    adv: '表达清晰，能带动人', risk: '话多，忽略倾听',
    match: '多创造表达机会', pit: '抢话、输出过载', tip: '倾听后再表达，把握节奏',
  },
  competition: {
    name: '竞争', desc: '享受较量，在对比中激发动力，追求领先。',
    adv: '斗志旺盛，追求卓越', risk: '过于看重输赢',
    match: '设立有挑战的目标', pit: '把合作也变成较劲', tip: '把竞争对手设定为自己昨天的成绩',
  },
  fairness: {
    name: '公平', desc: '坚持一视同仁，重视规则与公正。',
    adv: '公正可靠，深受信任', risk: '对例外缺乏弹性',
    match: '讲规则、给透明', pit: '僵化执行、不懂变通', tip: '规则之外多留人情与灵活',
  },
  command: {
    name: '统帅', desc: '敢于决策与担当，习惯带领大家把事做成。',
    adv: '决断力强，能扛事', risk: '强势，忽略他人意见',
    match: '尊重其决策权', pit: '独断专行、听不进建议', tip: '重大决定前先征询团队意见',
  },
  learner: {
    name: '学习', desc: '享受掌握新知识新技能的成长感。',
    adv: '成长快，适应新领域', risk: '贪多，难以深入',
    match: '不断提供学习机会', pit: '只学不用，学而不精', tip: '学一项就用一项，形成闭环',
  },
  positivity: {
    name: '积极', desc: '习惯看到积极面，能把乐观传给身边的人。',
    adv: '感染力强，提振士气', risk: '回避负面，报喜不报忧',
    match: '适合担任带动氛围的角色', pit: '忽视真实风险与问题', tip: '乐观之外也正视并处理问题',
  },
  ideation: {
    name: '思维', desc: '喜欢独处深度思考，琢磨现象背后的道理。',
    adv: '洞察深刻，有独到见解', risk: '想太多、动手少',
    match: '给独处与思考时间', pit: '沉溺想法，迟迟不行动', tip: '给每个想法配上落地动作',
  },
  strategic: {
    name: '战略', desc: '擅长看大局、辨方向，提前布局。',
    adv: '方向感强，未雨绸缪', risk: '想得远却忽略眼前细节',
    match: '让其主导方向规划', pit: '忽略执行细节与当下', tip: '方向之外也盯住落地步骤',
  },
  woo: {
    name: '取悦', desc: '乐于认识新朋友、赢得好感，快速建立连接。',
    adv: '社交能力强，人脉广', risk: '广而不深，关系浮于表面',
    match: '让其承担对外拓展', pit: '认识很多却难有深交', tip: '在广结善缘之外经营几段深关系',
  },
  responsibility: {
    name: '责任', desc: '答应的事必定兑现，靠承诺驱动。',
    adv: '守信可靠，值得托付', risk: '揽过多责任，累垮自己',
    match: '可放心托付承诺', pit: '来者不拒、过度承诺', tip: '学会分清轻重，敢于拒绝',
  },
  arranger: {
    name: '统筹', desc: '擅长安排人、事、资源，多头并进。',
    adv: '组织协调强，调度有序', risk: '大包大揽，事必躬亲',
    match: '让其统筹复杂项目', pit: '过度掌控、不相信他人', tip: '学会授权，放心把事情交给别人',
  },
  restorative: {
    name: '排难', desc: '享受解决棘手难题，越难越兴奋。',
    adv: '迎难而上，解决问题强', risk: '只重「救火」，忽略预防',
    match: '交给它复杂难题', pit: '沉迷救火、不建防线', tip: '解决问题后补上预防机制',
  },
};

export const GALLUP_TEST: ITestDef = {
  id: 'gallup',
  name: '盖洛普优势识别器',
  category: 'popular',
  desc: '聚焦发现你的天赋优势而非短板，帮助你把精力投入擅长的事。简化版选取 15 个常见优势主题。',
  time: '10-14 分钟',
  trust: '流行测评 · 学术争议较大，仅供参考',
  icon: 'TrendingUp',
  module: 'GALLUP',
  kind: 'topType',
  questions: [
    { q: '我喜欢每天都有具体成果可看', opts: p('achiever') },
    { q: '想到的事我习惯立刻去做', opts: p('action') },
    { q: '做决定前，我要把数据和逻辑想清楚', opts: p('analytical') },
    { q: '我喜欢把想法清楚地讲给别人听', opts: p('communication') },
    { q: '我享受与他人较量、力争上游', opts: p('competition') },
    { q: '我坚持对所有人都一视同仁', opts: p('fairness') },
    { q: '我习惯带领大家把事做成', opts: p('command') },
    { q: '我喜欢接触新知识、新技能', opts: p('learner') },
    { q: '我习惯看到事物积极的一面', opts: p('positivity') },
    { q: '我常独自深入琢磨问题背后的道理', opts: p('ideation') },
    { q: '我擅长看清大局与方向', opts: p('strategic') },
    { q: '我乐于认识新朋友、赢得好感', opts: p('woo') },
    { q: '答应别人的事，我必定兑现', opts: p('responsibility') },
    { q: '我擅长安排人力与资源、多头并进', opts: p('arranger') },
    { q: '我享受解决棘手难题的快感', opts: p('restorative') },
  ],
  typesMeta: GALLUP_META,
  compute(answers) {
    const types: ITypePoint[] = Object.keys(GALLUP_META).map((k) => ({
      key: k, name: GALLUP_META[k].name, score: sumW(answers, k),
    }));
    const sorted = [...types].sort((a, b) => b.score - a.score);
    const primary = sorted[0];
    return {
      kind: 'topType',
      summary: `你目前最突出的优势主题是「${primary.name}」。优势是可以通过投入持续放大的，建议把更多时间放在你的优势主题上。`,
      types: sorted.slice(0, 5),
      primaryKey: primary.key,
      primaryName: primary.name,
      tags: ['盖洛普', '流行测评'],
      disclaimer: DISCLAIMER,
    };
  },
};

