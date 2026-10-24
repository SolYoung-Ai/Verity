// 站点集中配置（改品牌信息只动这里）
// EXPORTS: SITE, BASE

const BASE = (import.meta.env.MIAODA_CLIENT_BASE_PATH || '').replace(/\/$/, '') + '/';

export const SITE = {
  name: 'VERITY',
  shortName: 'VERITY',
  tagline: '人格测评与个人生活规划平台',
  logoImg: `${BASE}logo.png`,
  ownerImg: `${BASE}solyoung.jpg`,
  ownerName: 'Solyoung',
  ownerTitle: '站点作者',
  ownerBio: '记录我的创作、实践，以及正在发生的可能。',
  personalSite: 'https://solyoung.top/',
  douyinImg: `${BASE}douyin.png`,
  xiaohongshuImg: `${BASE}xiaohongshu.png`,
  footerNote: 'Personality & Life Planning · 作者 Solyoung',
  copyright: '© 2026 VERITY · 保留所有权利',
  disclaimer:
    '本网站所有测评与规划工具仅供自我参考，不能替代心理咨询师、精神科医生、持牌理财顾问的专业评估，请勿将结果作为婚恋、招聘、升学、投资等重大决策的唯一依据。',
  // 类别元数据：删除无依据的星级，统一为克制的标签色
  categoryMeta: {
    academic: {
      label: '标准化量表',
      en: 'ASSESSMENT',
      color: 'text-stone-700 bg-stone-100 dark:text-stone-300 dark:bg-stone-800/70',
      desc: '具备心理学实证基础，适合深度自我觉察',
    },
    popular: {
      label: '人格类型',
      en: 'PERSONALITY',
      color: 'text-stone-700 bg-stone-100 dark:text-stone-300 dark:bg-stone-800/70',
      desc: '网络热门人格框架，仅供个人参考',
    },
    fun: {
      label: '行为探索',
      en: 'EXPLORATION',
      color: 'text-stone-700 bg-stone-100 dark:text-stone-300 dark:bg-stone-800/70',
      desc: '轻松探索，无严谨心理学效度',
    },
    finance: {
      label: '财务规划工具',
      en: 'PLANNER',
      color: 'text-orange-700 bg-orange-50 dark:text-orange-300 dark:bg-orange-950/40',
      desc: '基于输入与假设的情景模拟，非投资建议',
    },
  } as const,
};

export const BASE_PATH = BASE;
