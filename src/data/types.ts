// 测试业务类型与数据结构
// EXPORTS: TestCategory, IOption, IQuestion, TestKind, DimensionMeta, TypeMeta,
//          IDimensionPoint, ITypePoint, IMBTIDetail, IAttachmentDetail, TestResult, ITestDef

export type TestCategory = 'academic' | 'popular' | 'fun' | 'finance';

export interface IOption {
  text: string;
  w?: Record<string, number>;
}

export interface IQuestion {
  q: string;
  opts: IOption[];
}

export type TestKind = 'dimension' | 'topType' | 'mbti' | 'attachment';

// 维度型测试：每个维度三档（低/中/高）的详细解读
export interface DimensionMeta {
  key: string;
  label: string;
  low?: string;
  mid?: string;
  high?: string;
  advLow?: string;
  riskLow?: string;
  advMid?: string;
  riskMid?: string;
  advHigh?: string;
  riskHigh?: string;
  matchLow?: string; // 适合的相处模式
  pitLow?: string; // 容易踩坑的现实场景
  tipLow?: string; // 自我调整小建议
  matchMid?: string;
  pitMid?: string;
  tipMid?: string;
  matchHigh?: string;
  pitHigh?: string;
  tipHigh?: string;
}

// 类型型测试：每个候选类型
export interface TypeMeta {
  name: string;
  desc: string;
  adv: string; // 优势
  risk: string; // 潜在短板
  match: string; // 适合相处模式
  pit: string; // 容易踩坑场景
  tip: string; // 自我调整建议
}

export interface IDimensionPoint {
  key: string;
  label: string;
  raw: number;
  percent: number;
  level: 'low' | 'mid' | 'high';
}

export interface ITypePoint {
  key: string;
  name: string;
  score: number;
}

export interface IMBTIDetail {
  code: string;
  base: string;
  isT: boolean;
  letterDesc: string[]; // 四维度中文说明
  adv: string;
  risk: string;
  match: string;
  pit: string;
  tip: string;
}

export interface IAttachmentDetail {
  type: string;
  anx: number;
  av: number;
  desc: string;
  adv: string;
  risk: string;
  match: string;
  pit: string;
  tip: string;
}

export interface TestResult {
  kind: TestKind;
  summary: string;
  dimensions?: IDimensionPoint[];
  types?: ITypePoint[];
  mbti?: IMBTIDetail;
  attachment?: IAttachmentDetail;
  primaryKey?: string;
  primaryName?: string;
  tags: string[];
  disclaimer: string;
}

export interface ITestDef {
  id: string;
  name: string;
  category: TestCategory;
  desc: string;
  time: string;
  trust: string;
  icon: string;
  kind: TestKind;
  /** 英文模块短标识（全大写，如 BIG FIVE / MBTI / ATTACHMENT），用于卡片 Header 展示 */
  module?: string;
  /** 是否为新增模块，卡片右上角展示 NEW 标签 */
  isNew?: boolean;
  questions: IQuestion[];
  dimensionMeta?: DimensionMeta[];
  typesMeta?: Record<string, TypeMeta>;
  compute: (answers: IOption[]) => TestResult;
}
