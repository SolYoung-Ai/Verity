// 新增流行类题库：乐嘉性格色彩、PDP、Belbin团队角色、爱的语言、拖延、逆商AQ、乐观悲观
// EXPORTS: FPA_TEST, PDP_TEST, BELBIN_TEST, LOVE_LANGUAGE_TEST, PROCRAST_TEST, AQ_TEST, LOT_TEST
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
  '本测试为流行趣味测评，学术上争议较大，仅供娱乐与自我参考，不能替代专业评估，请勿用于招聘、婚恋等重大决策。';

/* ================= 乐嘉性格色彩 FPA ================= */
const FPA_META: Record<string, TypeMeta> = {
  red: {
    name: '红色', desc: '热情开朗，乐于表达，行动迅速，喜欢被关注，情绪外放、感染力强。',
    adv: '热情主动，乐观，善于带动气氛', risk: '容易冲动、粗心，三分钟热度',
    match: '多给即时反馈与新鲜互动', pit: '急于表达而忽略细节与倾听', tip: '行动前多想一步，学会慢下来',
  },
  blue: {
    name: '蓝色', desc: '追求完美，沉稳内敛，重感情、爱思考，做事讲究原则与深度。',
    adv: '严谨深刻，重承诺，值得信赖', risk: '容易较真、完美主义、内耗',
    match: '真诚沟通，尊重其原则与节奏', pit: '把要求强加于人，相处紧绷', tip: '接纳不完美，学会放过自己也放过别人',
  },
  yellow: {
    name: '黄色', desc: '目标导向，果敢强势，追求效率与掌控，越挫越勇，喜欢主导。',
    adv: '目标感强，行动力与决断力突出', risk: '强势忽略他人感受，急功近利',
    match: '直接讲重点，尊重其主导权', pit: '把关系当战场，伤了和气', tip: '多倾听，学会示弱与协作',
  },
  green: {
    name: '绿色', desc: '平和温和，随遇而安，追求稳定和谐，耐心包容，不喜欢冲突。',
    adv: '包容耐心，稳定可靠，善于调和', risk: '害怕冲突，慢而被动，回避主张',
    match: '温和沟通，给足适应缓冲', pit: '一味顺从，自己的需求被忽略', tip: '练习表达立场，敢于说「不」',
  },
};

export const FPA_TEST: ITestDef = {
  id: 'fpa',
  name: '乐嘉性格色彩 (FPA)',
  category: 'popular',
  desc: '国内流行的性格色彩测试，把人分为红、蓝、黄、绿四种色彩，帮助你快速了解自己的性格倾向与相处之道。',
  time: '6-9 分钟',
  trust: '流行测评 · 学术争议较大，仅供参考',
  icon: 'Sparkles',
  module: 'FPA',
  kind: 'topType',
  questions: [
    { q: '我开朗外向，喜欢在人群中被关注', opts: p('red') },
    { q: '我做事快，想到就做，不喜欢拖延', opts: p('red') },
    { q: '我情绪来得快，笑容和热情很容易感染人', opts: p('red') },
    { q: '我对事情要求高，追求尽善尽美', opts: p('blue') },
    { q: '我重感情、讲义气，在意承诺与忠诚', opts: p('blue') },
    { q: '我习惯想清楚再表达，不喜欢草率', opts: p('blue') },
    { q: '我目标感极强，认准的事一定要做成', opts: p('yellow') },
    { q: '我喜欢掌控局面、主导节奏', opts: p('yellow') },
    { q: '我越挫越勇，不怕竞争与挑战', opts: p('yellow') },
    { q: '我脾气好，很少和人起冲突', opts: p('green') },
    { q: '我喜欢安稳平和，不喜欢大起大落', opts: p('green') },
    { q: '我善于倾听，能让身边人感到安心', opts: p('green') },
    { q: '我说话快、情绪外露，藏不住心事', opts: p('red') },
    { q: '我对人对事比较认真，不太将就', opts: p('blue') },
    { q: '我不喜欢拖泥带水，讲求效率', opts: p('yellow') },
    { q: '遇到分歧我倾向退让、求同存异', opts: p('green') },
  ],
  typesMeta: FPA_META,
  compute(answers) {
    const types: ITypePoint[] = Object.keys(FPA_META).map((k) => ({
      key: k, name: FPA_META[k].name, score: sumW(answers, k),
    }));
    const sorted = [...types].sort((a, b) => b.score - a.score);
    const primary = sorted[0];
    return {
      kind: 'topType',
      summary: `你的主导性格色彩是「${primary.name}」。多数人是几种色彩的混合，次高色彩也会影响你的行为，建议结合来看。`,
      types: sorted,
      primaryKey: primary.key,
      primaryName: primary.name,
      tags: ['性格色彩', '流行测评'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= PDP 职业人格 ================= */
const PDP_META: Record<string, TypeMeta> = {
  tiger: {
    name: '老虎', desc: '支配型：果敢决断，目标导向，追求结果与效率，喜欢掌控和挑战。',
    adv: '决断力强，敢闯敢干，结果导向', risk: '强势急躁，忽略他人感受',
    match: '直接谈结果，尊重其决策权', pit: '逼得太紧，让人喘不过气', tip: '多倾听、多授权，学会放慢节奏',
  },
  peacock: {
    name: '孔雀', desc: '表达型：热情外向，善于表达与感染，乐于表现，社交能力强。',
    adv: '感染力强，善于沟通与调动氛围', risk: '浮于表面，承诺多、落地少',
    match: '多赞美鼓励，给足表现舞台', pit: '热热闹闹却忽略收尾细节', tip: '热情之后补上落地执行',
  },
  koala: {
    name: '考拉', desc: '耐心型：温和稳当，重视和谐协作，耐心包容，追求稳定安全。',
    adv: '耐心可靠，善于维持团队和睦', risk: '回避冲突，决策偏慢被动',
    match: '循序渐进，给足适应缓冲', pit: '一味迁就，意见被埋没', tip: '关键处练习坚定表达立场',
  },
  owl: {
    name: '猫头鹰', desc: '精确型：严谨细致，注重数据与规则，追求准确，谨慎而条理清晰。',
    adv: '严谨精确，逻辑清晰，可靠', risk: '过度较真细节，决策偏慢',
    match: '提供数据依据，讲逻辑', pit: '纠结细节耽误整体进度', tip: '抓大放小，重要的事先推进',
  },
};

export const PDP_TEST: ITestDef = {
  id: 'pdp',
  name: 'PDP 职业人格',
  category: 'popular',
  desc: '职场流行的人格分类：老虎（支配）、孔雀（表达）、考拉（耐心）、猫头鹰（精确），帮你定位自己的工作风格与协作偏好。',
  time: '6-9 分钟',
  trust: '流行测评 · 学术争议较大，仅供参考',
  icon: 'Crown',
  module: 'PDP',
  kind: 'topType',
  questions: [
    { q: '我习惯快速拍板、推动事情落地', opts: p('tiger') },
    { q: '我享受挑战，遇到难题越挫越勇', opts: p('tiger') },
    { q: '工作中我喜欢掌控进度和方向', opts: p('tiger') },
    { q: '我善于表达，能很快和团队打成一片', opts: p('peacock') },
    { q: '我喜欢分享观点，乐于表现自己', opts: p('peacock') },
    { q: '我的热情能调动身边的人', opts: p('peacock') },
    { q: '我性格温和，讲究团队和气', opts: p('koala') },
    { q: '我做事耐心，愿意配合别人节奏', opts: p('koala') },
    { q: '我讨厌冲突，希望和大家和睦相处', opts: p('koala') },
    { q: '我做事情讲数据、讲规则，力求准确', opts: p('owl') },
    { q: '我谨慎细致，不喜欢冒进', opts: p('owl') },
    { q: '我对细节有要求，不容含糊', opts: p('owl') },
    { q: '我敢于对现状说不，主动改变局面', opts: p('tiger') },
    { q: '我享受在人前展示、赢得关注', opts: p('peacock') },
    { q: '我善于倾听，是团队里的定心丸', opts: p('koala') },
    { q: '我习惯先分析清楚再行动', opts: p('owl') },
  ],
  typesMeta: PDP_META,
  compute(answers) {
    const types: ITypePoint[] = Object.keys(PDP_META).map((k) => ({
      key: k, name: PDP_META[k].name, score: sumW(answers, k),
    }));
    const sorted = [...types].sort((a, b) => b.score - a.score);
    const primary = sorted[0];
    return {
      kind: 'topType',
      summary: `你在职场中的主导风格是「${primary.name}」。不同对象和场景可能需要你切换风格，善用优势、补足短板，协作会更顺畅。`,
      types: sorted,
      primaryKey: primary.key,
      primaryName: primary.name,
      tags: ['PDP', '职场', '流行测评'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= Belbin 团队角色 ================= */
const BELBIN_META: Record<string, TypeMeta> = {
  shaper: {
    name: '鞭策者', desc: '推动团队前进，目标明确、行动快，善于应对挑战，把事做成。',
    adv: '干劲足，敢推动，能扛压力', risk: '急功近利，容易与人摩擦',
    match: '给目标与行动空间', pit: '推得太急引起团队反弹', tip: '照顾节奏，多激励少施压',
  },
  coordinator: {
    name: '协调者', desc: '聚焦目标、善于组织分工，能让不同人协同一致，成熟而务实。',
    adv: '统筹力强，善于协调资源', risk: '过度依赖他人，亲自上手偏少',
    match: '给足协调与授权空间', pit: '分工不清时效率变低', tip: '关键环节亲自把关',
  },
  plant: {
    name: '智多星', desc: '提供创新点子与方案，思维发散，善于解决非常规难题。',
    adv: '创意多，突破思维定式', risk: '点子发散，落地执行偏弱',
    match: '给创意空间，别急着泼冷水', pit: '想法太多难以聚焦', tip: '为创意配上执行方案',
  },
  monitor: {
    name: '审议员', desc: '冷静客观，善于评估利弊，从多个角度分析，避免团队盲动。',
    adv: '判断冷静，善于纠偏把关', risk: '过度谨慎，阻碍行动',
    match: '尊重其分析与质疑', pit: '反复纠结导致错失时机', tip: '设定决策期限，评估后尽快行动',
  },
  implementer: {
    name: '执行者', desc: '把想法变成可执行的方案并落地，可靠、务实、有条理。',
    adv: '执行力强，靠谱落地', risk: '缺少变通，灵活性偏弱',
    match: '给清晰任务与步骤', pit: '流程固化、难应变', tip: '主动尝试新方法优化流程',
  },
  resource: {
    name: '资源调查者', desc: '善于拓展外部资源与人脉，捕捉机会，推动内外连接。',
    adv: '人脉广，机会嗅觉敏锐', risk: '兴趣分散，浅尝辄止',
    match: '让其对接外部与机会', pit: '来去匆匆、难持续深耕', tip: '把新机会带回团队深入跟进',
  },
  teamworker: {
    name: '凝聚者', desc: '关心团队氛围，善于倾听与调解，让团队更团结、沟通更顺畅。',
    adv: '凝聚力强，善于调解关系', risk: '回避冲突，优柔寡断',
    match: '多让其维护团队氛围', pit: '为和气回避关键问题', tip: '该处理的分歧也敢于直面',
  },
  completer: {
    name: '完美主义者', desc: '关注细节与质量，追根究底，保证交付尽善尽美、不出纰漏。',
    adv: '严谨细致，质量有保证', risk: '苛求完美，进度偏慢',
    match: '让其负责质量把关', pit: '细节内卷拖累整体', tip: '分清主次，允许「完成优于完美」',
  },
  specialist: {
    name: '专家', desc: '提供专业的知识与技能，深入钻研某一领域，为团队贡献专长。',
    adv: '专业精深，权威可靠', risk: '视野偏窄，不愿涉猎其他',
    match: '尊重其专业权威', pit: '固守专业、协作不足', tip: '主动跨界学习，拓展视野',
  },
};

export const BELBIN_TEST: ITestDef = {
  id: 'belbin',
  name: 'Belbin 团队角色',
  category: 'popular',
  desc: '著名的团队角色理论（简化版），识别你在团队中最常发挥的角色，如鞭策者、智多星、执行者、凝聚者等，帮助你更高效地协作。',
  time: '8-11 分钟',
  trust: '流行测评 · 简化改编，仅供参考',
  icon: 'Users',
  module: 'BELBIN',
  kind: 'topType',
  questions: [
    { q: '团队停滞时，我习惯站出来推动大家往前走', opts: p('shaper') },
    { q: '我擅长把不同的人组织起来，让大家往一处使劲', opts: p('coordinator') },
    { q: '我常能冒出别人想不到的新点子', opts: p('plant') },
    { q: '做决定前，我会冷静分析方案的利弊', opts: p('monitor') },
    { q: '我擅长把计划一步步落实成可执行的事', opts: p('implementer') },
    { q: '我认识的人多，善于为团队牵线搭桥', opts: p('resource') },
    { q: '团队气氛紧张时，我习惯出面调解缓和', opts: p('teamworker') },
    { q: '我对交付质量很较真，总想把它做到完美', opts: p('completer') },
    { q: '在专业问题上，大家会来问我拿意见', opts: p('specialist') },
    { q: '遇到挑战我反而更有动力去攻破', opts: p('shaper') },
    { q: '我善于分配任务、把握进度节奏', opts: p('coordinator') },
    { q: '我喜欢解决常规方法搞不定的难题', opts: p('plant') },
    { q: '团队头脑发热时，我是那个泼冷水把关的人', opts: p('monitor') },
    { q: '我可靠踏实，交办的事基本能办妥', opts: p('implementer') },
    { q: '我乐于把外面的资源、机会带进团队', opts: p('resource') },
    { q: '我关心每个人的感受，是团队的润滑剂', opts: p('teamworker') },
    { q: '我习惯把细节抠得很细，避免出错', opts: p('completer') },
    { q: '我在某个专业领域钻研得比较深', opts: p('specialist') },
  ],
  typesMeta: BELBIN_META,
  compute(answers) {
    const types: ITypePoint[] = Object.keys(BELBIN_META).map((k) => ({
      key: k, name: BELBIN_META[k].name, score: sumW(answers, k),
    }));
    const sorted = [...types].sort((a, b) => b.score - a.score);
    const primary = sorted[0];
    return {
      kind: 'topType',
      summary: `你在团队中最常扮演的角色是「${primary.name}」。一个人可以扮演多个角色，健康团队需要不同角色互补，找到自己最顺手的角色，协作会更高效。`,
      types: sorted.slice(0, 4),
      primaryKey: primary.key,
      primaryName: primary.name,
      tags: ['Belbin', '团队角色', '流行测评'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= 5 种爱的语言 ================= */
const LOVE_META: Record<string, TypeMeta> = {
  words: {
    name: '肯定的言辞', desc: '通过口头或文字表达肯定、欣赏与鼓励，让你感受到爱与被爱。',
    adv: '善于表达，能给伴侣情绪价值', risk: '容易只说不做，行动偏少',
    match: '多给对方真诚的口头肯定', pit: '夸奖落空，被说「光会嘴上说」', tip: '把赞美配上一个具体的行动',
  },
  time: {
    name: '精心时刻', desc: '通过专注的相处、高质量的陪伴与共同活动来表达爱。',
    adv: '重视陪伴，愿意投入时间经营关系', risk: '需要大量专注相处，缺了会觉得被冷落',
    match: '安排专属时间，专注陪伴', pit: '相处时却各看手机，等于没陪', tip: '把相处时间当成约会，放下手机',
  },
  gifts: {
    name: '接受礼物', desc: '通过送礼物、小惊喜来表达在意，礼物的心意比价值更重要。',
    adv: '细心，善于用礼物表达心意', risk: '容易把关系简化为送礼',
    match: '留意其想要的，送有心思的小礼', pit: '只重仪式感，忽略日常陪伴', tip: '礼物之外多补日常的关心',
  },
  acts: {
    name: '服务的行为', desc: '通过帮对方做事、解决实际问题来表达爱，如分担家务、接送、跑腿。',
    adv: '务实可靠，用行动证明在意', risk: '闷头做事，缺少口头情感表达',
    match: '主动分担实际事务', pit: '做了很多却不被领情，觉得委屈', tip: '做事同时也要说出口表达心意',
  },
  touch: {
    name: '身体的接触', desc: '通过拥抱、牵手、依偎等肢体接触表达亲密与安全感。',
    adv: '亲密感强，肢体语言丰富', risk: '依赖身体接触，异地或缺拥抱会不安',
    match: '多给肢体接触表达亲密', pit: '在对方不想时硬要肢体亲近', tip: '尊重对方边界，适度表达亲密',
  },
};

export const LOVE_LANGUAGE_TEST: ITestDef = {
  id: 'love-language',
  name: '5 种爱的语言',
  category: 'popular',
  desc: '了解你主要用哪种方式表达爱、也最容易被哪种方式打动：肯定的言辞、精心时刻、接受礼物、服务的行为、身体的接触。',
  time: '6-9 分钟',
  trust: '流行测评 · 仅供参考',
  icon: 'Heart',
  module: 'LOVE LANGUAGE',
  kind: 'topType',
  questions: [
    { q: '我喜欢对方真诚地夸奖我、肯定我', opts: p('words') },
    { q: '我希望对方经常对我说些暖心的话', opts: p('words') },
    { q: '我很在意伴侣能不能看见并称赞我的付出', opts: p('words') },
    { q: '我希望和对方有专属的、不受打扰的相处时间', opts: p('time') },
    { q: '一起散步、聊天、专注陪伴让我很幸福', opts: p('time') },
    { q: '对方放下手机好好陪我，我会很感动', opts: p('time') },
    { q: '收到对方用心准备的小礼物会让我开心很久', opts: p('gifts') },
    { q: '我会留意对方想要的东西，悄悄买来送ta', opts: p('gifts') },
    { q: '礼物和惊喜在我心里分量很重', opts: p('gifts') },
    { q: '对方帮我分担家务、跑腿办事，我最受用', opts: p('acts') },
    { q: '我喜欢用行动而不是嘴上的话去关心对方', opts: p('acts') },
    { q: '对方为我付出实际行动时，我觉得ta最在乎我', opts: p('acts') },
    { q: '拥抱、牵手让我感到被爱和安全', opts: p('touch') },
    { q: '我喜欢和对方有肢体上的亲密接触', opts: p('touch') },
    { q: '亲密的身体接触比言语更让我安心', opts: p('touch') },
  ],
  typesMeta: LOVE_META,
  compute(answers) {
    const types: ITypePoint[] = Object.keys(LOVE_META).map((k) => ({
      key: k, name: LOVE_META[k].name, score: sumW(answers, k),
    }));
    const sorted = [...types].sort((a, b) => b.score - a.score);
    const primary = sorted[0];
    return {
      kind: 'topType',
      summary: `你最主要的爱的语言是「${primary.name}」。了解彼此的语言，试着用对方需要的方式去表达爱，关系会亲密很多。`,
      types: sorted,
      primaryKey: primary.key,
      primaryName: primary.name,
      tags: ['爱的语言', '亲密关系', '流行测评'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= 拖延倾向 ================= */
const PROCRAST_META: DimensionMeta[] = [
  {
    key: 'procr', label: '拖延倾向',
    low: '拖延少，行动及时，自律较强', high: '拖延明显，任务常拖到最后一刻', mid: '有一定拖延，多数能按时完成',
    advLow: '执行力强，效率高，可靠', riskLow: '节奏偏快，容易给自己过大压力',
    matchLow: '可放心交办，尊重其节奏', pitLow: '因效率高而揽过多任务', tipLow: '注意劳逸结合，避免过度紧绷',
    advHigh: '压力下爆发力强，能救急', riskHigh: '常临时抱佛脚，质量与身心受影响',
    matchHigh: '帮其拆解任务、设小节点', pitHigh: '拖到deadline手忙脚乱', tipHigh: '把任务拆小，从5分钟开始，先动起来',
    advMid: '有基本自律，能按时推进', riskMid: '面对困难或厌烦任务易拖延', pitMid: '把难事无限往后推', tipMid: '先做最难的一块，剩下的会顺畅很多',
  },
];

export const PROCRAST_TEST: ITestDef = {
  id: 'procrastination',
  name: '拖延倾向测试',
  category: 'popular',
  desc: '评估你的拖延程度与习惯，帮助你认识自己为何拖延、如何改善，把任务推进得更轻松。',
  time: '4-6 分钟',
  trust: '流行测评 · 仅供参考',
  icon: 'Clock',
  module: 'PROCRASTINATION',
  kind: 'dimension',
  questions: [
    { q: '任务没到最后一刻，我通常不太会开始', opts: p('procr') },
    { q: '我常把事情拖到不得不做才动手', opts: p('procr') },
    { q: '计划好的事，我常常迟迟不启动', opts: p('procr') },
    { q: '面对困难的任务，我更容易一拖再拖', opts: p('procr') },
    { q: '我常因为拖延而感到后悔或焦虑', opts: p('procr') },
    { q: '我习惯先做简单的事，把难的放后面', opts: p('procr') },
    { q: '我通常能按计划及时完成任务', opts: p('procr', true) },
    { q: '重要的事我会优先处理，不拖延', opts: p('procr', true) },
    { q: '我做事干脆，想到就做', opts: p('procr', true) },
    { q: '我的自律性还不错，很少拖延', opts: p('procr', true) },
  ],
  dimensionMeta: PROCRAST_META,
  compute(answers) {
    const dims = buildDimensionPoints([
      { key: 'procr', label: '拖延倾向', raw: sumW(answers, 'procr'), min: -8, max: 8 },
    ]);
    const d = dims[0];
    const map = { low: '较低', mid: '中等', high: '较高' } as const;
    return {
      kind: 'dimension',
      summary: `你的拖延倾向为「${map[d.level]}」（${d.percent}%）。拖延不是懒，常是对任务的畏难或启动困难，学会拆解和「先开始」往往就能改善。`,
      dimensions: dims,
      primaryKey: d.key,
      primaryName: d.label,
      tags: ['拖延', '自我成长'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= 逆商 AQ ================= */
const AQ_META: DimensionMeta[] = [
  {
    key: 'aq', label: '抗挫折能力（逆商）',
    low: '遇挫容易气馁、自责，复原较慢', high: '遇挫能快速调整，越挫越勇', mid: '有韧性，多数时候能挺过困难',
    advLow: '对风险敏感，遇事先求稳', riskLow: '受挫后容易一蹶不振、自我否定',
    matchLow: '多鼓励陪伴，少指责打击', pitLow: '一次失败就全盘否定自己', tipLow: '把失败归因到「可改变的行动」，而不是自己这个人',
    advHigh: '韧性强，抗压，能带动团队', riskHigh: '过于逞强，忽略情绪与求助',
    matchHigh: '放心交办难题', pitHigh: '硬扛到透支也不肯示弱', tipHigh: '再强的韧劲也需要休息与求助',
    advMid: '面对困难能自我调节恢复', riskMid: '重大打击下容易动摇', pitMid: '长期压力下韧性消耗', tipMid: '给情绪留出口，建立支持网络',
  },
];

export const AQ_TEST: ITestDef = {
  id: 'aq',
  name: '逆商测试 (AQ)',
  category: 'popular',
  desc: '衡量你在面对逆境、挫折和压力时的反应与复原能力，帮你更有韧性地应对生活中的困难。',
  time: '4-6 分钟',
  trust: '流行测评 · 仅供参考',
  icon: 'Mountain',
  module: 'AQ',
  kind: 'dimension',
  questions: [
    { q: '遇到挫折，我能很快调整状态重新出发', opts: p('aq') },
    { q: '我习惯把问题看成暂时的、可以解决的', opts: p('aq') },
    { q: '失败后，我能从教训里快速总结经验', opts: p('aq') },
    { q: '压力越大，我反而越能集中精力应对', opts: p('aq') },
    { q: '我不会因为一次挫折就否定自己的能力', opts: p('aq') },
    { q: '挫折会让我消沉很久，很难走出来', opts: p('aq', true) },
    { q: '遇到困难，我容易觉得自己无能为力', opts: p('aq', true) },
    { q: '小小的不顺就会让我很烦躁', opts: p('aq', true) },
    { q: '我会把一次失败扩散成对整体的怀疑', opts: p('aq', true) },
    { q: '面对压力，我常常选择逃避或拖延', opts: p('aq', true) },
  ],
  dimensionMeta: AQ_META,
  compute(answers) {
    const dims = buildDimensionPoints([
      { key: 'aq', label: '抗挫折能力', raw: sumW(answers, 'aq'), min: -8, max: 8 },
    ]);
    const d = dims[0];
    const map = { low: '较弱', mid: '中等', high: '较强' } as const;
    return {
      kind: 'dimension',
      summary: `你的抗挫折能力（逆商）为「${map[d.level]}」（${d.percent}%）。逆商不是天生不变的，通过调整归因方式和训练复原力，是可以逐步提升的。`,
      dimensions: dims,
      primaryKey: d.key,
      primaryName: d.label,
      tags: ['逆商', '抗挫', '自我成长'],
      disclaimer: DISCLAIMER,
    };
  },
};

/* ================= 乐观 / 悲观倾向 LOT ================= */
const LOT_META: DimensionMeta[] = [
  {
    key: 'opt', label: '乐观倾向',
    low: '偏悲观，习惯预期不好的结果', high: '乐观积极，习惯看到希望与可能', mid: '乐观与悲观并存，视情境而定',
    advLow: '考虑周全，提前防范风险', riskLow: '习惯性悲观，容易消极、内耗',
    matchLow: '多给积极视角与肯定', pitLow: '把坏的可能放大，错过机会', tipLow: '练习为每个担忧找一条「万一成了呢」的可能',
    advHigh: '积极乐观，有感染力，抗挫强', riskHigh: '盲目乐观，低估真实风险',
    matchHigh: '直接坦诚沟通，避免报喜不报忧', pitHigh: '忽视隐患，准备不足', tipHigh: '乐观之外也要做风险预案',
    advMid: '能现实看待，也有积极心态', riskMid: '状态差时乐观感会下降', pitMid: '心情不好时容易转向悲观', tipMid: '留意自己归因方式的惯性',
  },
];

export const LOT_TEST: ITestDef = {
  id: 'lot',
  name: '乐观 / 悲观倾向 (LOT)',
  category: 'popular',
  desc: '经典生活取向测试（简化版），评估你对未来的总体期待与乐观倾向，了解你的归因习惯。',
  time: '4-6 分钟',
  trust: '学术量表 · 简化改编，仅供参考',
  icon: 'Sun',
  module: 'LOT',
  kind: 'dimension',
  questions: [
    { q: '不确定的时候，我倾向相信事情会朝好的方向发展', opts: p('opt') },
    { q: '总体上，我觉得自己的未来是光明的', opts: p('opt') },
    { q: '遇到困难，我习惯期待会有转机', opts: p('opt') },
    { q: '我对自己的目标最终能实现有信心', opts: p('opt') },
    { q: '好事发生在我身上时，我会觉得是常态', opts: p('opt') },
    { q: '我常担心事情不会如我所愿', opts: p('opt', true) },
    { q: '面对未来，我经常先想到坏的结果', opts: p('opt', true) },
    { q: '我不太相信「努力就会有回报」', opts: p('opt', true) },
    { q: '遇到不顺，我容易觉得是自己运气差', opts: p('opt', true) },
    { q: '我常常觉得事情不会那么容易变好', opts: p('opt', true) },
  ],
  dimensionMeta: LOT_META,
  compute(answers) {
    const dims = buildDimensionPoints([
      { key: 'opt', label: '乐观倾向', raw: sumW(answers, 'opt'), min: -8, max: 8 },
    ]);
    const d = dims[0];
    const map = { low: '偏悲观', mid: '中和', high: '偏乐观' } as const;
    return {
      kind: 'dimension',
      summary: `你的总体倾向为「${map[d.level]}」（${d.percent}%）。乐观与悲观各有利弊，关键是匹配现实——乐观时留风险预案，悲观时多找积极可能。`,
      dimensions: dims,
      primaryKey: d.key,
      primaryName: d.label,
      tags: ['乐观', '归因', '自我成长'],
      disclaimer: DISCLAIMER,
    };
  },
};
